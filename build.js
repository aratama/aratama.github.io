"use strict";

const marked = require("marked");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const emoji = require('node-emoji');
const mikan = require('mikanjs');

// templetes
const articleTemplete = fs.readFileSync("templete-article.html").toString();
const templeteIndex = fs.readFileSync("templete-index.html").toString();

// configurations
const siteTitle = "ちょっと小さいのはたしかですが。";
const siteSubTitle = "プログラミングとかのブログ";

glob("raw/*.md", {}, (err, sources) => {

    // generate articles
    sources.forEach(file => {
        console.log(`compiling ${file} ...`);

        const renderer = new marked.Renderer();
        renderer.heading = (text, level) => {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `<h${level}><a name="${escapedText}" class="anchor" href="#${escapedText}"><span class="header-link"></span></a>${text}</h${level}>`;
        };
        renderer.code = (code, lang) => {
            return `<pre><code class="${lang}">${code}</code></pre>`;
        };
        renderer.image = (href, title, text) => {
            const q = "https://qiita-image-store.s3.amazonaws.com/0/";
            const href_ = href.startsWith(q) ? "/img/" + path.basename(href) : href;
            return `<a href="${href_}"><img src="${href_}"></img></a>`;
        };

        const source = fs.readFileSync(file).toString();
        const metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        const metadata = metadataString == null ? {} : JSON.parse(metadataString[1]);
        const date = new Date(metadata.created_at);
        const tags = metadata.tags.map(tag => `<a href="${tag.name}.html"><span class="tag"><i class="fa fa-tag" aria-hidden="true"></i>${tag.name}</span></a>`).join("\n");

        const rendered = eval("`" + articleTemplete + "`");
        fs.writeFileSync(`blog/${path.basename(file, ".md")}.html`, rendered);
    });

    // generate an index file
    const articles = sources.map(file => {
        const source = fs.readFileSync(file).toString();
        const metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        if(metadataString){
            const metadata = JSON.parse(metadataString[1]);
            return Object.assign({ url: `${path.basename(file, ".md")}.html` }, metadata);
        }else{
            return {
                title: file, 
                url: file
            }
        }
    });

    const items = articles.map(article => {
        return `<a href="${article.url}"><li class="article">${article.title}</li></a>`;
    }).join("\n");
    fs.writeFileSync("blog/index.html", eval("`" + templeteIndex + "`"));
});

