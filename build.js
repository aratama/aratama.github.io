"use strict";

const marked = require("marked");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const emoji = require('node-emoji');
const mikan = require('mikanjs');

// templetes
const articleTemplete = fs.readFileSync("template/article.html").toString();
const templeteIndex = fs.readFileSync("template/index.html").toString();
const header = fs.readFileSync("template/header.html").toString();
const footer = fs.readFileSync("template/footer.html").toString();
const sns = fs.readFileSync("template/sns.html").toString();

// configurations
const siteTitle = "ちょっと小さいのはたしかですが。";
const siteSubTitle = "わたしのブログです。面白いかどうかは、わかりませんが。";

glob("raw/*.md", {}, (err, sources) => {

    // generate articles
    const entries = sources.map(file => {
        console.log(`compiling ${file} ...`);

        const images = [];

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
            images.push(href_);
            return `<a href="${href_}"><img src="${href_}"></img></a>`;
        };
        renderer.link = (href, title, text) => {
            debugger;
            var url = href.startsWith("http://qiita.com/hiruberuto/items/") ? path.basename(href) : href;
            return `<a href="/blog/${url}.html">${text}</a>`;
        };

        const source = fs.readFileSync(file).toString();
        const metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        const metadata = metadataString == null ? {} : JSON.parse(metadataString[1]);
        const date = new Date(metadata.created_at);
        const tags = metadata.tags.map(tag => `<a href="${tag.name}.html"><span class="tag"><i class="fa fa-tag" aria-hidden="true"></i>${tag.name}</span></a>`).join("\n");
        const basename = `${path.basename(file, ".md")}.html`;
        const pageTitle = metadata.title + " - " + siteTitle;

        const rendered = `<title>${pageTitle}</title>` + eval("`" + header + articleTemplete + footer + "`");
        fs.writeFileSync(`blog/${basename}`, rendered);

        return { file, images }
    });

    // generate an index file
    const articles = entries.map(entry => {
        const file = entry.file;
        const thumbnail = entry.images.length > 0 ? entry.images[0] : "/res/empty.png";
        const source = fs.readFileSync(file).toString();
        const metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        if(metadataString){
            const metadata = JSON.parse(metadataString[1]);
            return Object.assign({ url: `${path.basename(file, ".md")}.html`, thumbnail }, metadata);
        }else{
            return {
                title: file, 
                url: file,
                thumbnail: null,
                created_at: ""
            }
        }
    }).sort((x, y)=> new Date(y.created_at) - new Date(x.created_at));

    const items = articles.map(article => {
        const date = new Date(article.created_at);
        return `<a href="/blog/${article.url}">
                    <li class="article-entry">
                        <div class="thumbnail" style="background-image: url(${article.thumbnail})"></div>
                        <div class="date">${date.getFullYear()}年${1 + date.getMonth()}月${date.getDate()}日</div>
                        <div class="title">${article.title}</div>
                    </li>
                </a>`;
    }).join("\n");
    const pageTitle = siteTitle;
    fs.writeFileSync("index.html", `<title>${pageTitle}</title>` + eval("`" + header + templeteIndex + footer + "`"));
});

