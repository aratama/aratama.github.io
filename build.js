var marked = require("marked");
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var emoji = require('node-emoji');

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



        var source = fs.readFileSync(file);
        var rendered = `
<link rel="stylesheet" href="/res/highlight/styles/default.css">
<script src="/res/highlight/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script>
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$']]}
});
</script>
<link rel="stylesheet" href="../style.css">
<body>
    <div class="content">
        <header>${file}</header>
        <article id="rendered">
            <p><a href="index.html">目次</a></p>
            ${marked(emoji.emojify(source.toString()), { renderer: renderer })}
        </article>
    </div>
</body>
        `;
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
        return `<li><a href="${article.url}">${article.title}</a></li>`;
    }).join("\n");
    fs.writeFileSync("blog/index.html", `
    <link rel="stylesheet" href="/style.css">
    <article>
        <ul>${items}</ul>
    </article>`);
});

