export const environment = {
    production: false,
    firebase: {
        projectId: process.env['NG_APP_PROJECTID'],
        appId: process.env['NG_APP_APPID'],
        storageBucket: process.env['NG_APP_STORAGEBUCKET'],
        apiKey: process.env['NG_APP_APIKEY'],
        authDomain: process.env['NG_APP_AUTHDOMAIN'],
        messagingSenderId: process.env['NG_APP_MESSAGINGSENDERID']
    }
};
