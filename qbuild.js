"use strict";

const marked = require("marked");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const url = require("url");
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
const siteSubTitle = "Admittedly something small.";
const sourceDir = "src";
const site = "https://aratama.github.io/";
const pinned = ["site", "463219b158d74668e7d9", "2316b58162cfec150460"];

glob(`${sourceDir}/*.md`, {}, (err, sources) => {

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
            const match = /(.+?):(.+?)/.exec(lang);
            const lang_ = match ? match[1] : lang;
            return `<pre><code class="${lang_}">${code}</code></pre>`;
        };
        renderer.image = (href, title, text) => {
            const q = "https://qiita-image-store.s3.amazonaws.com/0/";
            const href_ = href.startsWith(q) ? "/img/" + path.basename(href) : href;
            images.push(href_);
            return `<a href="${href_}"><img src="${href_}"></img></a>`;
        };
        renderer.link = (href, title, text) => {
            var url = href.startsWith("http://qiita.com/hiruberuto/items/") ? `/blog/${path.basename(href)}.html` : href;
            return `<a href="${url}">${text}</a>`;
        };
        renderer.paragraph = (text) => {
            const match = /^\s*\[\^(.*?)\]\:(.*)/g.exec(text);
            if(match){
                footnotes.push(`<p class="footnote"><a name="footnote-${match[1]}" href="#${match[1]}">^</a>${match[2]}</p>`);
                return "";
            }else{
                return `<p>${text}</p>`;
            }
        };

        var footnotes = [];

        const source = fs.readFileSync(file).toString();
        const metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        const metadata = metadataString == null ? {} : JSON.parse(metadataString[1]);
        const date = new Date(metadata.created_at);
        const tags = metadata.tags.map(tag => `<a href="${tag.name}.html"><span class="tag"><i class="fa fa-tag" aria-hidden="true"></i>${tag.name}</span></a>`).join("\n");
        const basename = `${path.basename(file, ".md")}.html`;
        const pageTitle = metadata.title + " - " + siteTitle;


        const emojified = emoji.emojify(source);
        const footnoted = emojified.replace(/\[\^(.*?)\]:(.*)/g, (match, name, text) => {
            footnotes.push(`<p class="footnote"><a href="#link-${name}" name="footnote-${name}">^</a> ${emoji.emojify(text)}</p>`);
            return "";
        }).replace(/\[\^(.*?)\]/g, (match, name) => {
            return `<a class="link-footnote" href="#footnote-${name}" name="link-${name}">※</a>`;
        });
        const content = marked(footnoted, { renderer: renderer }) + footnotes.join("\n");
        const renderedContent = eval("`" + articleTemplete + "`");
        const thumbnail = url.resolve(site, 0 < images.length ? images[0] : `res/empty.png` );
        const rendered = eval("`" + header + "`") + renderedContent + eval("`" + footer + "`");

        fs.writeFileSync(`blog/${basename}`, rendered);

        return { file, images }
    });

    // generate an index file
    const articles = entries.map(entry => {
        const file = entry.file;
        const thumbnail = url.resolve(site, entry.images.length > 0 ? entry.images[0] : "res/empty.png");
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
    });

    const pinnedArticles = articles.filter(a => pinned.includes(a.id)).sort((x, y)=> new Date(y.created_at) - new Date(x.created_at));
    const history = articles.filter(a => ! pinned.includes(a.id)).sort((x, y)=> new Date(y.created_at) - new Date(x.created_at));    

    function render(xs){
        return xs.map(article => {
            const date = new Date(article.created_at);
            return `<a href="/blog/${article.url}">
                        <div class="article-entry">
                            <div class="thumbnail" style="background-image: url(${article.thumbnail})"></div>
                            <div class="date">${date.getFullYear()}年${1 + date.getMonth()}月${date.getDate()}日</div>
                            <div class="title">${article.title}</div>
                        </div>
                    </a>`;
        }).join("\n");        
    }

    const items = `<h2>ピックアップ</h2>` + render(pinnedArticles) + `<h2 style="clear:both">最近の投稿</h2>` + render(history);
    const pageTitle = siteTitle;
    const thumbnail = url.resolve(site, "res/empty.png");
    fs.writeFileSync("index.html", eval("`" + header + templeteIndex + footer + "`"));
    fs.writeFileSync("entries.json", JSON.stringify(articles, null, 2));    
});

