const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

function fetchArticle(itemId){
    console.log(`Fetching ${itemId}...`);
    fetch(`http://qiita.com/api/v2/items/${itemId}`).then(res => {
        res.json().then(json => {
            fs.writeFileSync(`raw/${json.id}.md`, `<!-- ${JSON.stringify({ 
                id: json.id, 
                created_at: json.created_at,
                tags: json.tags, 
                title: json.title
            }, null, 2)} -->\n${json.body}`);
        });
    });
}

const subcommand = process.argv[2];
if(subcommand == "update"){
    fs.readdirSync("raw").forEach(file => {
        fetchArticle(path.basename(file, ".md"));
    });
}else{
    process.argv.filter(arg => arg.match(/[a-z0-9]{20}/)).forEach(fetchArticle);
}