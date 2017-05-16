"use strict";

const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const co = require('co');

const sourceFileDir = "src";
const imageFileDir = "img";

function* saveArticle(json){
    yield fs.writeFile(`${sourceFileDir}/${json.id}.md`, `<!-- ${JSON.stringify({ 
        id: json.id, 
        created_at: json.created_at,
        tags: json.tags, 
        title: json.title
    }, null, 2)} -->\n${json.body}`);

    const imgPattern = /!\[.*?\]\((.*?)\)/g;
    var match;
    while(match = imgPattern.exec(json.body)){
        const imgPath = match[1];
        const dest = `${imageFileDir}/${path.basename(imgPath)}`;
        const exists = yield fs.exists(dest);
        if( ! exists){
            console.log(`Fetching ${imgPath}...`);
            const res = yield fetch(imgPath)
            const buffer = yield res.buffer();
            yield fs.writeFile(`${imageFileDir}/${path.basename(imgPath)}`, buffer);
        }
    }
}

function* fetchArticle(itemId){
    console.log(`Fetching ${itemId}...`);
    const res = yield fetch(`http://qiita.com/api/v2/items/${itemId}`); 
    const json = yield res.json(); 
    yield saveArticle(json);
}

function filterQiitaQrticle(xs){
    return xs.filter(arg => arg.match(/[a-z0-9]{20}/));
}

co(function*(){
    const subcommand = process.argv[2];
    if(subcommand == "update"){
        const raws = yield fs.readdir(sourceFileDir);
        const files = filterQiitaQrticle(raws.map(file => path.basename(file, ".md")));
        for(var i = 0; i < files.length; i++){
            yield fetchArticle(files[i]);
        }
    }else if(subcommand == "user"){
        const userName = process.argv[3];
        console.log(`fetching articles for user ${userName}...`);
        const resUser = yield fetch(`http://qiita.com/api/v2/users/${userName}`);
        const jsonUser = yield resUser.json(); 
        var articles = [];
        console.log(jsonUser.items_count);        
        for(var page = 1; articles.length < jsonUser.items_count; page++){
            const res = yield fetch(`http://qiita.com/api/v2/users/${userName}/items?per_page=100&page=${page}`);
            const json = yield res.json();
            articles = articles.concat(json);
        }
        for(var i = 0; i < articles.length; i++){
            console.log(JSON.stringify(articles[i].title, null, 2));
            yield saveArticle(articles[i]);
        }
    }else if(subcommand == "item"){
        const args = filterQiitaQrticle(process.argv);
        for(var i = 0; i < args.length; i++){
            yield fetchArticle(args[i]);
        }
    }else{
        console.log(`
Usage:

    node qfetch.js item <item-id>
        fetch the article.

    node qfetch.js user <user-id>
        fetch all articles and images of the user.

    node qfetch.js update
        update exists article sources.
`);
    }
});
