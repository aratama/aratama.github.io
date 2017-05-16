<!-- {
  "id": "f1e048fc9a8ca51eddb2",
  "created_at": "2015-04-09T22:08:58+09:00",
  "tags": [
    {
      "name": "JavaScript",
      "versions": []
    },
    {
      "name": "Haskell",
      "versions": []
    },
    {
      "name": "関数型言語",
      "versions": []
    },
    {
      "name": "altjs",
      "versions": []
    },
    {
      "name": "purescript",
      "versions": []
    }
  ],
  "title": "関数型なAltJS、PureScriptの入門書を邦訳しました。"
} -->

**追記: この翻訳は超古いです。本文中のサンプルコードの多くは、最新版のコンパイラではコンパイルが通りません。最新の情報については、原著を参照してください。**基本的な概念は変わらないので、この翻訳もまったく参考にならないというわけではないと思いますが、なるべく原著を読むことをおすすめします。

現在のPureScriptでの開発環境構築については、[純粋関数型プログラミング言語PureScriptのはじめかた／コンパイラの使いかたからサーバサイドアプリケーション・クライアントサイドシングルページアプリケーション開発まで](http://qiita.com/hiruberuto/items/2316b58162cfec150460)の記事も併せてご覧ください。

----

Haskellライクな関数型プログラミング言語PureScriptの入門書、"PureScript By Example"を邦訳しました。本書はPureScriptのオリジナルの作者であるPhilさん本人が執筆した入門書です。本書を理解するにはJavaScriptを知っていることが望ましいですが、そうでなくともすでに何らかのプログラミング言語を知っていれば読みこなすことはできると思います。PureScriptはHaskellを始めとした多くの関数型言語と様々な考え方を共有していますから、PureScriptという言語そのものを学ぶという目的でなくとも、関数型プログラミング全般についての入門としても読むにも適しています。**無料**ですので、ぜひ読んでみてください。

- [実例によるPureScript](http://hiruberuto.bitbucket.org/purescript/)

原著も以下のページで無料で読めます。翻訳ミスが疑われたり、翻訳が読みにくい箇所があれば、原著にあたってみてください。原著は購入することもできますので、本書が気に入った方はぜひ購入してみてください。

- [PureScript by Example](https://leanpub.com/purescript/read)

## 本書の内容

タイトルの通り、本書はとにかく具体的なコードをばんばん見せてから、それに添って説明していくというスタイルです。すべてのサンプルコードはオンラインで入手できますし、演習もついていますので、実際に手を動かしながら理解を深めることができます。言語仕様を端からがっつりという感じではありませんし、数学的な定義がどうのこうのという抽象的な話もほとんどありませんから、比較的取り組みやすいのではないかと思います。扱うサンプルコードは次のような実用性の高いものばかりです。

* 住所録アプリケーション
* 2次元平面上を歩いてアイテムを集めるテキストベースのアドベンチャーゲーム
* HTML5 Canvas APIを使ったCanvasへのグラフィックス描画
* HTMLフォームに入力されたデータの妥当性検証
* QuickCheckによるランダムなユニットテストの自動生成
* JSONデータの型安全な読み取り
* 非同期処理のための領域特化言語によるコールバック地獄の解消
* 安全なページ内リンクを可能にした、HTMLテンプレートとしての領域特化言語の開発

関数型言語の入門のサンプルコードは、パズルでも解いているかのような実用性が感じられないものばかり取り沙汰されることがありますが、その点、本書は関数型プログラミングを現実の開発でどのように実用していくかを常に念頭に置きながら学習できます。標準入出力だけで済ませるような地味なものだとモチベーションが上がらない人もいるでしょうが、PureScriptコードはJavaScriptコードへとコンパイルできるので、Canvas APIでグラフィックスを扱ったりAjaxで通信してみたりと、比較的派手なことがしやすいのも魅力です。

開発環境のインストールから、対話式環境の操作、gruntを利用したビルドやテストの自動化まで取り扱っています。**関数型プログラミングの概念や言語仕様だけでなく、開発の一連の流れについての包括的な解説になっています**。

## Haskeller向けのあれこれ

Haskellを知っている人向けに、本書でどのような話題を扱っているかキーワードとして挙げておきます。**Freeモナド**や**Extensible Effects**のような比較的新しい話題も扱っていますから、すでにHaskellに馴染みがある人にとっても参考になるかもしれません。

- 関数、レコード(JavaScriptのようなオブジェクト)、再帰、代数的データ型
- マップ、畳込み、パターン照合、ポイントフリースタイル、多相型、行多相
- 関手、Applciative、モナド、モナド変換子、モナドスタック、MonadTrans 
- 各種の型クラスや基本的なモナド(Reader,Writer,State,ST,Either,Error,Eff,Monoid,Alternative,MonadPlusなどなど)、do記法
- 拡張可能作用(Extensible Effects)、ファントム型、ランクN多相
- Foreign Function Interface、PureScriptのデータ型の実行時表現
- QuickCheck、Arbitrary型クラス、CoArbitrary型クラス
- Freeモナドを利用した領域特化言語の実装

PureScriptはHaskellに強い影響を受けていますが、決してHaskellのサブセットやHaskellそのものを目指しているわけではありません。HaskellとPureScriptの決定的な違いとしては次のような点が挙げられます。

* **正格評価**
* ネイティブな副作用のモナドが`IO`じゃなくて、Extensible Effectsである`Eff`
* JavaScriptへとコンパイルされる(実験的なC++バックエンドもあるようです)
* レコード型(JavaScriptのような『オブジェクト』)と行多相

そのほか、forallが必須だったり、リスト内包表記がなかったりと微妙な違いがいろいろありますが、よく訓練されたHaskellerならそのうち慣れると思います。逆に言えばそれ以外はHaskellそっくりで、QuickCheckなどのライブラリはHaskellから移植して使っているようです。型クラスまわりの表現力はHaskellに近いレベルのものが確保されており、`Functor`/`Applicative`/`Monad` という階層や、`MonadTrans`のような型クラスもしっかり実現されています。

## 注意

今のところ邦訳のデータはBitBucketに置いていますが、そのうちGithubのほうに移動したりするかもしれません。URLはもしかしたら変わるかもしれないのでご注意ください。まだ訳が硬くて読みにくい部分も多かったり、誤訳も多いかと思われますが、そのうち直していこうかなと思います。誤訳があればすべて私個人の責任です。もし邦訳の内容に問題を見つけたら、このqiitaのページにコメントを残して頂くと私が気が付きやすいです。

## さいごに

英語なら関数型プログラミングの資料はたくさん手に入りますが、やはり英語と日本語だと読む速度が何倍も違ってきます。Haskellについては日本語でもすでに良い入門書が何冊も出版されていますが、本書の内容はそれらに比肩するたいへん充実したものです。そしてなにより**無料**で読めますから、気が向いた時や暇なときに気軽に読んで頂けたらと思います。書籍にはどうしても肌に合う合わないがありますから、市販の本を買って馬が合わずに損した気分になるより、まずは**関数型プログラミングに無料体験**してみるのはどうでしょうか。関数型プログラミングに本気で取り組むぞというほどの気概がなくて、関数型プログラミングはなんぞやということをちょっとかじりたいだけの人にもお勧めです。

## おまけ・無料関数型プログラミング書籍特集

本書だけでは物足りない、まとまった量の関数型プログラミング入門テキストが欲しい！でも紙の本をお金出して買うほどじゃないという人向けの、無料で読める関数型プログラミング関連の書籍をまとめておきます。他にもあったら教えて下さい。

* [やさしいHaskell 入門](http://www.sampou.org/haskell/tutorial-j/index.html) - 私がHaskellをいじり始めたときには日本語の書籍が出版されていなかったので、私はこれでHaskellに入門しました。ちょっと古いですが、入門用としてはさほど問題無いと思います。『やさしい』……？
* [Learn You a Haskell for Great Good!](http://learnyouahaskell.com/) - 英語ですが、表紙のポップなゾウさんが目印の可愛い本です。可愛さに釣られて手に取る人が続出しています。比較的新しい本なので安心です。
* [計算機プログラムの構造と解釈](http://sicp.iijlab.net/fulltext/xcont.html) - とても有名な古文書です。Schemeは知っておいて損のない言語ですし、Haskellを学ぶのとはまた別の~~新たな性癖に目覚める~~新しい世界が見えてくるかもです。和田さんのSICP邦訳とは別に、新たに邦訳が公開されたようです。やったぜ。http://vocrf.net/docs_ja/jsicp.pdf

* [型システム入門 プログラミング言語と型の理論](http://estore.ohmsha.co.jp/titles/978427406911P) - 無料で読めるのは第一章だけですが、それだけでも読む価値があります。プログラムについて重要な直感を与えてくれると思います。



<!--

----

## 訳語メモ

この翻訳にはいろいろ問題がありそうだなというのは筆者も感じてます。もし問題を感じたかたがいればコメントください。

### 翻訳の方針メモ

* カタカナ語をなるべく避け、可能な限り日本語に訳す。カタカナ語に直せない場合は、検索エンジンでも検索しやすいようにアルファベットそのままに残す。例："Applicaive Functor"→「Applicative関手」。「アプリカティブファンクター」というように訳す手もないわけではありませんが、「アプリカティブ」「ファンクタ」のいずれも一般的なカタカナ語ではないため、筆者はそれが読みやすくなっているとは思いません。
* 一般的な日本語としてすでに充分定着したカタカナ語は積極的に避ける事はしない。例：「データ」「コンテナ」「ルール」などはそのまま使う。
* 専門分野でのみ使われるカタカナ語は専門知識がないと読みにくいのでなるべく避けたいが、先例があり、それが避け難いならそれに従う。例：「インスタンス」「モノイド」「モナド」など。「モナド」は「単子」というような翻訳もあるようですが、あまり一般的でないように思います。`Monad`というようにアルファベットそのままにする手もありだと思いますが、今回はとりあえず「モナド」にしています。

* 専門用語以外でカタカナ語が避けにくい時には、その語が用語として重要でない限り、文章全体を意味を保ったまま表現を変える。例：

    > The `psci` interactive mode allows for rapid prototyping with immediate feedback

    "rapid prototyping"という語を「ラピッドプロトタイピング」というようにそのままカタカナ語にしてしまう訳者もいますが、本書ではそのような用語を避けるように、「psci 対話式処理系では反応を即座に得られるので」というように訳しています。また、

    > Now let's write some utility functions for working with phone books.

    という文も、「ユーティリティ関数」というカタカナ語を回避するため、 

    > 今度は電話帳の操作を支援する関数をいくつか書いてみましょう。

    という訳にしています。

----

訳語の選択に迷いました。誰かの参考になるかもしれないので、メモとして掲載しておきます。



##### kind 種

「類」と訳されることもありますが、どうも数学の界隈では以前から「種」と訳されていたらしく、最近では「種」のほうで訳される流れだとか。統一さえされればどっちでもいいと思います。「種類」は単語として一般的過ぎるので避けました。今回は園芸の話ではないので、「種」でも混同はないと判断し、それを使っています。

##### predicate function 述語関数

日本語の「述語」と論理学のpredicateは明らかに異なるので、predicateを述語と訳すのはちょっと厳しいと思います。ここで言いたいのは、その関数が真か偽を返す関数だということであって、「動作や状態の主体」という意味の「述語」を割り当てるのは嬉しくありません。ここで言っているのは`true`または`false`を返す関数であることを言っています。

##### traverse 走査する

あまり普通じゃない訳ですが、「要素をひとつひとつ調べて処理していく」という意味に近い「走査」にしました。

##### row polymorphism 行多相

先例はありませんが、そのまんまです。

##### nest 入れ子

入れ子は入れ子でしょ？「ネスト」と訳すと、筆者は頭のなかでツバメがピーチクパーチク餌をねだりはじめるので避けました。

##### pattern matching  パターン照合  

これも半端にカタカナ語が混じっていて気になりますが、"pattern"にこなれた訳がないので、仕方なくこうしました。

##### pattern match failure パターン照合失敗　

語呂が悪いです

##### map マップ　

筆者は"mapping"というと数学の「写像」を思い浮かべてしまいますが、これを「写像」と呼ぶのは一般的すぎるので、苦し紛れに「マップ」にしています。前例に何か良い訳はないでしょうか。

##### folding 畳み込み　

筆者は「畳み込み」という語を見ると"convolution"という英単語が思い浮かんじゃうのですが、確か「プログラミングHaskell」とかを参考にして「畳み込み」にしました。

##### case式　　　

アルファベットと日本語が入り混じった変な訳語だと思いますが、この場合は"case"という予約語だから仕方ありません。カタカナ語じゃないのでセーフ！

##### primitive type 原始型

あんまり普通じゃない訳だけど、定着すれば定着すると思います。「プリミティブ型」のほうが一般的だと思いますが、私は「プリミティブ型」以外で「プリミティブ」という単語を日本語で聞くことはほとんどないと思うし、「プリミティブ」はカタカナ語として定着もしていないと思います。

##### instance インスタンス

「実例」「実体」あたりが良さそうな気もしますが、Haskell界隈でそう訳した先例が見受けられないので日和って「インスタンス」。HaskellやPureScriptのような言語では「実装」が意味としては近いですが、type classをimplementationしたのがinstanceなので、implementationを「実装」と訳すとinstanceを同じ「実装」とするわけにいかなくなります。

##### type class  型クラス

重箱読みとか湯桶読み的な、半端にカタカナ語が混じっていて微妙な用語。でも「クラス」はもうカタカナ語としてそこそこ定着しているので問題は少ないでしょう(筆者は集合論とかが頭をもたげるので、スッキリとはいきませんが)。下手に和訳すると「型級」となって、逆にわかりづらい気もします。我々は「クラス」という単語に慣れすぎました。「超弩級」を「スーパードレッドノートクラス」とかに書き換えてもわかりづらいので、妥協ポイント。

##### type class instance 型クラスインスタンス

……。中途半端すぎて泣きたい訳語。

##### type checker 型検証器

「チェッカ」とか正直わかりづらいと思います。日本人なら「検証器」でどうでしょうか。

##### function 関数

「関数」のほうが常用漢字な感じだし、意味としても近いと思います。「函」はファンクションのファンの音訳として中国語で使われていたものが輸入されたようですが、関数と箱だとかという説明がもう現代的じゃないと思います。現代的には関数は二項**関**係の特殊なものであって、その意味でも「関数」のほうが意味として適切でしょう。「函数」から「関数」への書き換えが進められたきっかけが常用漢字の導入にあったとしても、現代的には訳語として関数のほうが適切だと思います。

「関」という漢字の元の意味は「門のかんぬき」だそうで、そこから「物と物との繋ぎ目の仕組み」という意味が派生したそうな。まさにピッタリな漢字ではないでしょうか。「箱」「ブラックボックス」は関数に対するイメージとしては正しくありません。「箱」や「ブラックボックス」はつまり入力と出力の関係が**箱に隠されて見えない**ということに主眼が置かれていますが、関数に関して関係が**見えるかどうか**は関係ありません。対応関係を決めている法則が見えようが見えまいが、入力に対して出力の対応**関**係がただひとつ定まっていることが重要なのです。とディリクレ先生が言ってました。

「函数」と訳すのにこだわる人もいますが、「関係」という意味をもった「関」というぴったりの漢字があるのに、中国語の古い音訳にこだわって「函数」を使う理由はないと思います。

##### equality operator 等値演算子

equivalenceとqualityの違いとか……。「等価」と「等値」の違いとか……

##### non-strict 広義の

ケースバイケースですが、訳に困ってこれを使ったケースがあります。もちろん、評価戦略としての"strict evaluation"は「正格評価」です。お間違えのないように。

##### monoid モノイド

多分数学でしか使われない造語なのでそのまま「モノイド」でも仕方ないし、実際にそう訳されるのが普通です。「単系」とか「単位的半群」という訳語もあるようですが、あまり一般的でなさそうです。

##### ordered container 順序付きコンテナ

「コンテナ」……。カタカナ語なのであまり好きではありませんが、もう十分定着してる単語だからまあいいでしょう。「格納容器」とか言われても逆にわかりづらいです。

##### monad law モナド則

##### functor law 関手則

##### identity law 恒等射律

単位元律？lawが「律」だったり「則」だったりしてバラバラだけど、先例に従います。個人的には「律」のほうがかっこいいのでは。「因果律」とか中二っぽくてかっこいいじゃないですか。

##### double arrow 太った矢印

「太った矢印」はfat arrowですが、「二重線の矢印」もわかりづらい気がしたので。

##### equational reasoning 等式推論 

筆者は知らない分野。よくわからない

##### test テスト

「試験」とかに訳す勇気はありませんでした。小学生でも知っているカタカナ語としてスルー。

##### support 対応する

##### template テンプレート

「雛形」と訳す手も考えましたが、「雛形」の原義が「実物を作る前に制作される小さな模型」であることを考えると、微妙にわかりづらい。妥協して「テンプレート」

##### import/export インポート/エクスポート

搬入/搬出とか言われてもわかりづらそうなので妥協しました。exportは「露出」とかが意味として近いですが意味不明になりかねないのでやめました

##### error エラー

exceptionは例外という漢語なのにerrorはエラーというカタカナ語という不思議。でも「誤り」とはニュアンスが違うし、「失敗」はやや近いけどそれも違う気がします

##### indent 字下げ

「インデント」でもいいですけど、今回はやや過剰にカタカナ語を避けました

##### type system　型システム

「型体系」じゃわかりづらそうです

##### utility functions 支援関数

うーん、いい訳が思いつきません。とはいえ「ユーティリティ関数」も正直意味不明だとは思います。

##### capture

"Those types whose values can be randomly generated are captured by the `Arbitrary` type class"

「型が型クラスにcaptureされる」の"capture"適当な表現がわかりません。「<型>は<型クラス>のインスタンスを持つ」というような表現で回避しています。

##### phantom type

カタカナ語を増やしたくないので「幻影型」。中二力が高そう。「幽霊型」という翻訳例も見かけましたが「幻影型」のほうがかっこよくないでしょうか。

##### optional オプショナルな

いろいろ考えたんですが、どうしても適当な訳語が思いつかなくて一番困った語。専門用語というわけではないのでアルファベットのまま残す気にもならず、結局「オプショナルな」というカタカナ語になってます。これはひどい。


-->