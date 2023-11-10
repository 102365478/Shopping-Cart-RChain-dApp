# Shopping-Cart-RChain-dApp

A rchain shopping cart dapp demo.

I achieved login/register based on blockchain, upload/buy item based on blockchain.

My work mainly focused on the usage of blockchain.

Using hello-rchain api to interact with rchain blockchain, hello-rchain is the origin repo I forked from, which is based on rchain-toolkit api.

## Prerequisites

To use my dapp you need node.js env, node.js v18.18.0 and Ubuntu 20.04 is my working env.

1. This project uses CLOUDINARY as the online image hosting platform, so you need to configure the CLOUDINARY environment before deploying the project.

    First you need to register a CLOUDINARY account [here](https://cloudinary.com).

    In a terminal, set your `CLOUDINARY_URL` environment variable.

    Replace `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME` with the API environment variable copied from your product environment credentials:

    ```bash
    export CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    ```

    You can find more details on [CLOUDINARY](https://cloudinary.com/documentation/node_quickstart#4_transform_the_image).

2. Because the project is based on hello-rchain, you need to clone my project and config the rchain following the guidance of [hello-rchain](https://github.com/Alice2O3/Hello-RChain).

## Usage

After cloning my dapp, `cd` to my project root directory.

0. Make sure you have configed the rchain environment in `prerequisites 2`.

1. Delete everything in `rnode0` directory, copy everything from folder `rnode0 (override)` to folder `rnode0`.

   Whenever you want to reset the blockchain, just copy everything from folder `rnode0 (override)` to folder `rnode0`.

2. Starting rchain server

    ```bash
    npm install
    npm run rnode
    ```

3. In another terminal, cd to the `bin` directory of our project and run the following command to start nodejs server:

    ```bash
    npm install
    npm run start
    ``` 
    
4. Open your browse `localhost:3000` to use our dapp.

## Credits

Login form: [login-form](https://github.com/acmenlei/login-form)

Cart form: [nodejs-shopping-cart](https://github.com/gtsopour/nodejs-shopping-cart)

Hello-RChain: [Hello-RChain](https://github.com/Alice2O3/Hello-RChain)

RChain project: [https://github.com/rchain/rchain](https://github.com/rchain/rchain)

RChain key-pair generator: [https://tgrospic.github.io/rnode-client-js/](https://tgrospic.github.io/rnode-client-js/)

RChain-toolkit (from my knowledge it's the only working RChain api for v0.13.0-alpha3, so great thanks): [https://github.com/fabcotech/rchain-toolkit](https://github.com/fabcotech/rchain-toolkit)
