const fs = require("fs-extra");

async function main(){
    const create_at = new Date();
    const title = process.argv[2];
    const path = `src/${title}.md`;
    const stats = await fs.stat(path);
    if(stats.isFile()){
        console.error(`File "${path}" already exists.`);
    }else{
        await fs.writeFile(path, `<!-- {
    "id": "${title}",
    "created_at": "${create_at.toISOString()}",
    "tags": [
        {
        "name": "ブログ",
        "versions": []
        }
    ],
    "title": "タイトル"
} -->
`);
    }
}

main();