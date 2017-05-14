var marked = require("marked");
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var emoji = require('node-emoji');
const mikan = require('mikanjs');

const siteTitle = "ちょっと小さいのはたしかですが。";

var articleTemplete = fs.readFileSync("templete-article.html").toString();

var templeteIndex = fs.readFileSync("templete-index.html").toString();

glob("raw/*.md", {}, (err, sources) => {

    // generate articles
    sources.forEach(file => {
        console.log(`compiling ${file} ...`);

        var renderer = new marked.Renderer();
        renderer.heading = (text, level) => {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `<h${level}><a name="${escapedText}" class="anchor" href="#${escapedText}"><span class="header-link"></span></a>${text}</h${level}>`;
        };
        renderer.code = (code, lang) => {
            return `<pre><code class="${lang}">${code}</code></pre>`;
        };



        var source = fs.readFileSync(file).toString();
        var metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        var metadata = metadataString == null ? {} : JSON.parse(metadataString[1]);
        var date = new Date();
        var rendered = eval("`" + articleTemplete + "`");
        fs.writeFileSync(`blog/${path.basename(file, ".md")}.html`, rendered);
    });

    // generate an index file
    var articles = sources.map(file => {
        var source = fs.readFileSync(file).toString();
        var metadataString = /^<!--((.|\s)*?)-->/g.exec(source);
        if(metadataString){
            var metadata = JSON.parse(metadataString[1]);
            return Object.assign({ url: `${path.basename(file, ".md")}.html` }, metadata);
        }else{
            return {
                title: file, 
                url: file
            }
        }
    });

    var items = articles.map(article => {
        return `<a href="${article.url}"><li class="article">${article.title}</li></a>`;
    }).join("\n");
    fs.writeFileSync("blog/index.html", eval("`" + templeteIndex + "`"));
});

