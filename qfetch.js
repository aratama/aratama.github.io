"use strict";

const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const sourceFileDir = "src";
const imageFileDir = "img";

async function saveArticle(json){
    await fs.writeFile(`${sourceFileDir}/${json.id}.md`, `<!-- ${JSON.stringify({ 
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
        const exists = await fs.exists(dest);
        if( ! exists){
            console.log(`Fetching ${imgPath}...`);
            const res = await fetch(imgPath)
            const buffer = await res.buffer();
            await fs.writeFile(`${imageFileDir}/${path.basename(imgPath)}`, buffer);
        }
    }
}

async function fetchArticle(itemId){
    console.log(`Fetching ${itemId}...`);
    const res = await fetch(`http://qiita.com/api/v2/items/${itemId}`); 
    const json = await res.json(); 
    await saveArticle(json);
}

function filterQiitaQrticle(xs){
    return xs.filter(arg => arg.match(/[a-z0-9]{20}/));
}

async function main(){
    const subcommand = process.argv[2];
    if(subcommand == "update"){
        const raws = await fs.readdir(sourceFileDir);
        const files = filterQiitaQrticle(raws.map(file => path.basename(file, ".md")));
        for(var i = 0; i < files.length; i++){
            await fetchArticle(files[i]);
        }
    }else if(subcommand == "user"){
        const userName = process.argv[3];
        console.log(`fetching articles for user ${userName}...`);
        const resUser = await fetch(`http://qiita.com/api/v2/users/${userName}`);
        const jsonUser = await resUser.json(); 
        var articles = [];
        console.log(jsonUser.items_count);        
        for(var page = 1; articles.length < jsonUser.items_count; page++){
            const res = await fetch(`http://qiita.com/api/v2/users/${userName}/items?per_page=100&page=${page}`);
            const json = await res.json();
            articles = articles.concat(json);
        }
        for(var i = 0; i < articles.length; i++){
            console.log(JSON.stringify(articles[i].title, null, 2));
            await saveArticle(articles[i]);
        }
    }else if(subcommand == "item"){
        const args = filterQiitaQrticle(process.argv);
        for(var i = 0; i < args.length; i++){
            await fetchArticle(args[i]);
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
}

main();
