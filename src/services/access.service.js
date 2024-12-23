const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const {createTokenPair} = require('../auth/authUtils')
const {getInfoData} = require('../utils')
const {Api403Error, BusinessLogicError, Api401Error} = require("../core/error.response");
const {findByEmail} = require('./shop.service')
const apiKeyModel = require('../models/apikey.model')
const i18n = require('../configs/config.i18n')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '001',
    READ: '002',
    DELETE: '003',
    ADMIN: '000'
}

class AccessService {

    /**
     * Check this token used?
     * @param refreshToken
     * @returns {Promise<void>}
     */
    refreshToken = async ({
                            refreshToken,
                            user,
                            keyStore
                          }) => {
        const { userId, email } = user
        console.log({userId, email})

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // notify send email error...

            // delete token in keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new Api403Error(i18n.translate('messages.error001'))
        }

        if (refreshToken !== keyStore.refreshToken) throw new Api401Error(i18n.translate('messages.error002'))

        // check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new Api401Error(i18n.translate('messages.error000'))

        // create accessToken, refreshToken
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        // return new tokens
        return {
            user,
            tokens
        }
    }

    /**
     * Action logout
     *
     * @param keyStore
     * @returns {Promise<*>}
     */
    logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.debug(delKey)
        return delKey;
    }

    /**
     * 1 - Check email in dbs
     * 2 - Match password
     * 3 - Create AT vs RT and save
     * 4 - Generate tokens
     * 5 - Get guide return login
     *
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    singIn = async ({username, password}) => {
        // 1. check shop registered or not
        const foundShop = await findByEmail({email: username})
        if (!foundShop) throw new Api403Error(i18n.translate('messages.error002'))

        // 2. compare encrypt password
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new BusinessLogicError(i18n.translate('messages.error003'))

        // privateKey as privateKey2 to encode and verify refreshToken
        const privateKey1 = crypto.randomBytes(64).toString('hex')
        const privateKey2 = crypto.randomBytes(64).toString('hex')

        // // 3. create private key, public key with RSA
        // const {
        //     publicKey,
        //     privateKey,
        // } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 4096,
        //     publicKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        //     privateKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        // });

        // 4. generate tokens
        // // with RSA + JWT
        // const {_id: userId} = foundShop
        // const tokens = await createTokenPair({
        //     userId: userId.toString(),
        //     username
        // }, publicKey, privateKey)

        // await KeyTokenService.createKeyToken({
        //     userId: userId.toString(),
        //     privateKey,
        //     publicKey,
        //     refreshToken: tokens.refreshToken,
        // })
        
        //with two separate privateKey
        const {_id: userId} = foundShop
        const tokens = await createTokenPair({
            userId: userId.toString(),
            username
        }, privateKey1, privateKey2)

        await KeyTokenService.createKeyToken({
            userId: userId.toString(),
            publicKey: privateKey1,
            privateKey: privateKey2,
            refreshToken: tokens.refreshToken,
        })

        // get user info
        const shop = getInfoData({ fields: ['_id', 'name', 'email', 'password', 'roles'], object: foundShop})
        return {
            id: shop._id,
            username: shop.name,
            firstName: shop.name,
            lastName: shop.name,
            email: shop.email,
            password: shop.password,
            role: shop.roles[0],
            token: tokens.accessToken,
            // refresh_token: tokens.refreshToken,
        }
    }

    signUp = async ({name, email, password, msisdn}) => {
        // step1: check email exists?
        const holderShop = await shopModel.findOne({email}).lean()
        console.log('locale:::', i18n.getLocale())
        if (holderShop) {
            throw new Api403Error(i18n.translate('messages.error004'))
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, msisdn, roles: [RoleShop.SHOP]
        })

        if (!newShop) {
            return null
        }

        // privateKey as privateKey2 to encode and verify refreshToken
        const privateKey1 = crypto.randomBytes(64).toString('hex')
        const privateKey2 = crypto.randomBytes(64).toString('hex')
        // // create private key, public key with RSA
        // const {
        //     publicKey,
        //     privateKey,
        // } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 4096,
        //     publicKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        //     privateKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        // });
        // console.log(privateKey, '---', publicKey)
        console.log(privateKey1, '---', privateKey2)

        // const publicKeyString = await KeyTokenService.createKeyToken({
        //     userId: newShop._id,
        //     publicKey: publicKey.toString(),
        //     privateKey: privateKey.toString(),
        // })

        // if (!publicKeyString) {
        //     throw new BusinessLogicError(i18n.translate('messages.error005'))
        // }
        // console.log('publicKeyString:: ', publicKeyString)

        // // create public key to verify token with RSA
        // const publicKeyObject = await crypto.createPublicKey(publicKeyString)
        // console.log('publicKeyObject:: ', publicKeyObject)

        // // created token pair with RSA
        // const tokens = await createTokenPair(
        //     {
        //         userId: newShop._id,
        //         email
        //     },
        //     publicKeyObject,
        //     privateKey
        // )

        // created token pair with 2 separate private keys
        const tokens = await createTokenPair({
            payload: {
                userId: newShop._id,
                email
            },
            publicKey: privateKey1,
            privateKey: privateKey2
        })

        console.log('Created token success:: ', tokens)
        // apiKey
        const newKey = await apiKeyModel.create({
            key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']
        })

        return {
            shop: getInfoData(
                {
                    fields: ['_id', 'name', 'email', 'msisdn'],
                    object: newShop
                }
            ),
            tokens,
            key: getInfoData(
                {
                    fields: ['key'],
                    object: newKey
                })
        }
    }
}

module.exports = new AccessService()
