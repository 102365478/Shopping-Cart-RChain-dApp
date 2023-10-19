
/* standard info type:
    type = 0 - err info
    type = 1 - user info
    type = 2 - purchase info
    type = 3 - item info
*/

/*info define:

let err_info = {
    type: 0 ,
    err: ,
};

let user_info = {
    type:1 ,
    username: ,
    money: ,
};

let purchase_info = {
    type:2 ,
    seller_username: ,
    purchaser_username: ,
    item_id ,
    item_money: ,
};

let item_info = {
    type:3 ,
    seller_username: ,
    item_id ,
    item_money: ,
    iten_count: ,
};

*/

const decoder = async (str) => {
    return JSON.parse(str);
}

const decoder_deprecated = async (str) => {
    let i = str.indexOf("type:");
    let j = str.indexOf(",");
    if ( i !== -1) {
        let type = browserType.slice(i + 5, i + 6);
    }

    switch (type) {
        case 1: {
            str = str.slice(j + 1, str.length);
            i = str.indexOf("username:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let username = browserType.slice(i + 9, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("money:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let money = browserType.slice(i + 6, j);
            }

            let body = {
                type: type,
                username: username,
                money: money,
            };

            break;
        }

        case 2: {
            str = str.slice(j + 1, str.length);
            i = str.indexOf("seller_username:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let seller_username = browserType.slice(i + 16, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("purchaser_username:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let purchaser_username = browserType.slice(i + 19, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("item_id:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let item_id = browserType.slice(i + 16, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("item_money:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let item_money = browserType.slice(i + 19, j);
            }

            let body = {
                type: type ,
                seller_username: seller_username,
                purchaser_username:purchaser_username,
                item_id:item_id ,
                item_money: item_money,
            };

            break;

        }

        case 3: {
            str = str.slice(j + 1, str.length);
            i = str.indexOf("seller_username:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let seller_username = browserType.slice(i + 16, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("item_id:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let item_id = browserType.slice(i + 16, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("item_money:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let item_money = browserType.slice(i + 19, j);
            }

            str = str.slice(j + 1, str.length);
            i = str.indexOf("item_count:");
            j = str.indexOf(",");
            if ( i !== -1) {
                let item_count = browserType.slice(i + 19, j);
            }

            let body = {
                type:type ,
                seller_username: seller_username,
                item_id:item_id ,
                item_money: item_money,
                iten_count: iten_count,
            };

            break;

        }
        
        default: {

            let body = {
                type:0 ,
                err: "an error occured here",
            };
            break;
        }
    }

    return JSON.stringify(body);
}

const coder_user_info = async (username, money) => {
    let body = {
        type: 1,
        username: username,
        money: money,
    };

    var str = JSON.stringify(body);
    var des = "";
    while( str.indexOf("\\") != -1 ) {
        des += str.slice(0, start) + "\\";
        str = str.slice(start);
    }

    des += str;

    return;
}

const coder_purchase_info = async (seller_username, 
    purchaser_username ,
    item_id ,
    item_money) => {

        let body = {
            type: 2 ,
            seller_username: seller_username,
            purchaser_username:purchaser_username,
            item_id:item_id ,
            item_money: item_money,
        };

    return JSON.stringify(body);

}

const coder_item_info = async (seller_username ,
    item_id ,
    item_money ,
    iten_count ) => {

        let body = {
            type:3 ,
            seller_username: seller_username,
            item_id:item_id ,
            item_money: item_money,
            iten_count: iten_count,
        };

    return JSON.stringify(body);


}