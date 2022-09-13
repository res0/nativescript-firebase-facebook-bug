<template>
    <Page>
        <GridLayout>
            <StackLayout>
                <Button class="btn" @tap="askForNotifications">Get FireBase Notification</Button>
                <Button class="btn" @tap="fbLogin">Facebook Login</Button>
                <Label class="label" textWrap="true">{{ text }}</Label>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
import { LoginManager, AccessToken } from '@nativescript/facebook'
import { firebase } from '@nativescript/firebase-core'
import { AuthorizationStatus } from '@nativescript/firebase-messaging-core';

export default {
    data() {
        return {
            text: '',
        }
    },
    methods: {
        log(...txt) {
            console.log.apply(this, txt)
            this.text += `\n${txt.map(t => typeof t === 'object' ? JSON.stringify(t) : t).join(' ')}`
        },
        async fbLogin() {
            try {
                this.log('-----\nFacebook login...')
                const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
                const token = AccessToken.currentAccessToken()
                this.log(result)
                this.log('Facebook token:', token)
            } catch (e) {
                this.log('Facebook login error:', e)
            }
        },
        async askForNotifications() {
            this.log('-----\nRequesting push notification permission')

            let authStatus = await firebase().messaging().hasPermission()
            this.log('Has permission:', authStatus)
            
            if (authStatus !== AuthorizationStatus.AUTHORIZED && authStatus !== AuthorizationStatus.PROVISIONAL) {
                authStatus = await firebase()
                    .messaging()
                    .requestPermission({
                        ios: {
                            alert: true,
                        },
                    });
            }

            const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

            this.log('Enabled Push Notifications:', enabled)
            if (enabled) {
                this.log('Registering for remote messages...')
                try {
                    const didRegister = await firebase()
                        .messaging()
                        .registerDeviceForRemoteMessages() 
                    this.log('Registered remote messages:', didRegister)
                } catch(e) {
                    this.log('Error registering remote messages:', e)
                }


                this.log('Getting device token...')
                firebase()
                    .messaging()
                    .getToken()
                    .then((token) => {
                        this.log('Device Token: ', token)
                    })
                    .catch((e) => this.log('getToken error', e))

                firebase()
                    .messaging()
                    .onMessage((message) => {
                        this.log('Notification:', message)
                    })
                
                firebase()
                    .messaging()
                    .onNotificationTap((message) => {
                        this.log('Notification Tap:', message)
                    })
                
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .btn {
        margin-bottom: 15;
        background: #eee;
    }
    .label {
        white-space: normal;
    }
</style>
