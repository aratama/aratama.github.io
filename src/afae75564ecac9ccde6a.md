# TL;DR Version

JSONファイルを読み書きするには、[purescript-foreign-generic](https://github.com/paf31/purescript-foreign-generic)が便利です。



# JSONめんどうくさい

いまゲームを作っているんですが、実行環境ごとに適切な値が異なったり、実際にプレイしてみないと適切な値がわからないパラメータがたくさんあります。それで、コンパイルなしで細かい調節をできるようにしようといろんなパラメータをJSONのオプションファイルにくくり出しました。たとえばこんな感じです。

```json:JSONオプションファイル
{
    "loadDistance": 6,
    "fogDensity": 0.005,
    "maximumLoadedChunks": 2197
}
```

静的型付けの言語であるPureScriptで書いているので、このオプションファイルを読み取って次のような型のデータとして受け取りたいです。

```haskell
newtype Options = Options {
    loadDistance :: Int,
    fogDensity :: Number,
    maximumLoadedChunks :: Int
}
```

さて、[purescript-affjax](https://github.com/slamdata/purescript-affjax)パッケージを使ってオプションファイルをajaxで`get`すると、その結果の`response`プロパティは`Json`、`ArrayBuffer`、`Unit`、`String`、`Foreign`、`Document`、`Blob`のうちの任意の型で受け取ることができます。JSONを読み取った時はこのうち`Foreign`か`Json`を使うことになりますが、`Foreign`を使った場合はこんな感じになります。

```haskell
readOptions :: Foreign -> F Options
readOptions value = do
    loadDistance <- readProp "loadDistance" value
    fogDensity <- readProp "fogDensity" value
    maximumLoadedChunks <- readProp "maximumLoadedChunks" value
    pure $ Options {
        loadDistance,
        fogDensity,
        maximumLoadedChunks
    }
```

`Foreign`は[purescript-foreign](https://github.com/purescript/purescript-foreign)というパッケージで定義されているデータ型で、PureScriptで外部から何かのデータを受け取った時によく使われます。`Foreign`はJavaScriptの任意のデータを表していて、`readProp`関数を使うと`Foreign`なデータからプロパティを読み取ることができますので、`readProp`でプロパティを読み取っては変数に移し、最後にオブジェクトでまとめて返します。同じような式の繰り返しなので複雑というわけではありませんが、なんかちょっと冗長です。ちなみに、`Json`のほうで受け取ったとしても、`readProp`の代わりに`.?`という演算子でプロパティを読み取ることになるだけで、コーディングの手間としてはあんまり変わらなかったりします。

オプションが３つくらいならどうということはないのですが、開発が進むにつれてオプションがもりもりと増えてきてしまい、それに伴って読み取る部分のコードももりもり増えてきてしまいました。

```haskell
newtype Options = Options {
    loadDistance :: Int,
    fogDensity :: Number,
    maximumLoadedChunks :: Int,
    vertexColorEnabled :: Boolean,
    shadowEnabled :: Boolean,
    shadowDisplayRange :: Int,
    shadowMapSize :: Int,
    skyboxRotationSpeed :: Number,
    enableWaterMaterial :: Boolean,
    chunkUnloadSpeed :: Int,
    jumpVelocity :: Number,
    initialWorldSize :: Int,
    moveSpeed :: Number,
    cameraTargetSpeed :: Number,
    cameraRotationSpeed :: Number,
    cameraZoomSpeed :: Number,
    cameraMaxZ :: Number,
    cameraMinZ :: Number,
    cameraFOV :: Number,
    cameraMinimumRange :: Number,
    cameraMaximumRange :: Number,
    cameraHorizontalSensitivity :: Number,
    cameraVertialSensitivity :: Number,
    pointerHorizontalSensitivity :: Number,
    pointerVerticalSensitivity :: Number,
    landingVelocityLimit :: Number,
    landingDuration :: Int
}

readOptions :: Foreign -> F Options
readOptions value = do
    loadDistance <- readProp "loadDistance" value
    fogDensity <- readProp "fogDensity" value
    maximumLoadedChunks <- readProp "maximumLoadedChunks" value
    vertexColorEnabled <- readProp "vertexColorEnabled" value
    shadowEnabled <- readProp "shadowEnabled" value
    shadowDisplayRange <- readProp "shadowDisplayRange" value
    shadowMapSize <- readProp "shadowMapSize" value
    skyboxRotationSpeed <- readProp "skyboxRotationSpeed" value
    enableWaterMaterial <- readProp "enableWaterMaterial" value
    chunkUnloadSpeed <- readProp "chunkUnloadSpeed" value
    jumpVelocity <- readProp "jumpVelocity" value
    initialWorldSize <- readProp "initialWorldSize" value
    moveSpeed <- readProp "moveSpeed" value
    cameraTargetSpeed <- readProp "cameraTargetSpeed" value
    cameraRotationSpeed <- readProp "cameraRotationSpeed" value
    cameraZoomSpeed <- readProp "cameraZoomSpeed" value
    cameraMinZ <- readProp "cameraMinZ" value
    cameraMaxZ <- readProp "cameraMaxZ" value
    cameraFOV <- readProp "cameraFOV" value
    cameraMinimumRange <- readProp "cameraMinimumRange" value
    cameraMaximumRange <- readProp "cameraMaximumRange" value
    cameraHorizontalSensitivity <- readProp "cameraHorizontalSensitivity" value
    cameraVertialSensitivity <- readProp "cameraVertialSensitivity" value
    pointerHorizontalSensitivity <- readProp "pointerHorizontalSensitivity" value
    pointerVerticalSensitivity <- readProp "pointerVerticalSensitivity" value
    landingVelocityLimit <- readProp "landingVelocityLimit" value
    landingDuration <- readProp "landingDuration" value
    pure $ Options {
        loadDistance,
        fogDensity,
        maximumLoadedChunks,
        vertexColorEnabled,
        shadowDisplayRange,
        shadowEnabled,
        shadowMapSize,
        skyboxRotationSpeed,
        enableWaterMaterial,
        chunkUnloadSpeed,
        jumpVelocity,
        initialWorldSize,
        moveSpeed,
        cameraTargetSpeed,
        cameraRotationSpeed,
        cameraZoomSpeed,
        cameraMinZ,
        cameraMaxZ,
        cameraFOV,
        cameraMinimumRange,
        cameraMaximumRange,
        cameraHorizontalSensitivity,
        cameraVertialSensitivity,
        pointerHorizontalSensitivity,
        pointerVerticalSensitivity,
        landingVelocityLimit,
        landingDuration
    }
```

ぎゃあああああああああああああああああああああ！　オプションの名前がコードの中にそれぞれの4回も登場していて、これはなかなかつらいボイラープレイートです。まだ序盤でコレですから、さらに開発が進んだらどんなことになるやら。弱い型付けのJavaScriptならこんな手間はないわけで、こんなことをやっていてはやっぱり強い型付けの言語はめんどうくさいねと言われても仕方ありません。




# ジェネリックプログラミングは便利です

これではあんまりなので何かいい方法がないか探したんですが、そういえば最近PureScriptは**ジェネリックプログラミング**に力を入れていることを思い出しました。コンパイル時にデータ型の定義からいろいろなコードを自動的に生成してくれる便利なやつで、`Generic`というクラスのインスタンスを自動導出できるようになったのです。なお、`Generic`という名前のクラスは[`purescript-generics`パッケージの`Data.Generic.Generic`](https://pursuit.purescript.org/packages/purescript-generics/3.3.0/docs/Data.Generic#t:Generic)と[`purescript-generics-rep`パッケージの`Data.Generic.Rep.Generics`クラス](https://pursuit.purescript.org/packages/purescript-generics-rep/4.0.0/docs/Data.Generic.Rep#t:Generic)の2種類があって微妙に違います。`Data.Generic.Generic`は古いパッケージで、新しい`Data.Generic.Rep.Generics`パッケージのほうは古いパッケージに比べて少し制約が強くなり型安全性が向上しています。現在では古い`Data.Generic.Generics`を使う必要はなく、常に新しい方である`Data.Generic.Rep.Generics`を使えばいいみたいです。

`Data.Generic.Rep.Generics`を使えば自動的にJSONを読み取ることができるのは見当がつきましたが、きっと誰かがすでにそういうライブラリを作っているはずです。筆者は面倒くさがりなので、なるべくなら自分でライブラリを書きたくありません。探したら[purescript-foreign-generic](https://github.com/paf31/purescript-foreign-generic)パッケージがありました。これの使い方は簡単で、まずは`derive instance`で`Generic`のインスタンスを自動導出します。


```haskell
derive instance genericOptions :: Generic Options _
```

これで`readGeneric`という関数が使えるようになるので、これを呼び出すだけです。

```haskell
readOptions :: Foreign -> F Options
readOptions = readGeneric defaultOptions { unwrapSingleConstructors = true }
```

`readOptions`が恐ろしく簡単になりました。今までの苦労はなんだったんだ……。これだけでJSONを完全に型安全に読み取ることができますし、新たなオプションを追加したい時は、もう`readOptions`関数をいじる必要はありません。オプションファイル`options.json`に値を追加し、`Options`の型にプロパティの定義を追加するだけです。[purescript-argonaut](https://github.com/purescript-contrib/purescript-argonaut)、もう要らない子じゃん。

後になって、`readOptions`のような専用の関数を与えるのではなく、`IsForeign`クラスや`AsForeign`クラスのインスタンスにしたほうが何かと便利なことにも気が付きました。

```haskell
instance isForeignOptions :: IsForeign Options where
    read = readGeneric defaultOptions { unwrapSingleConstructors = true }

instance asForeignOptions :: AsForeign Options where
    write = toForeignGeneric defaultOptions { unwrapSingleConstructors = true }
```

これで、コンパイルが通る限りは`write`で確実にJSONへと変換できますし、`read`でJSONから安全に読み取ることができます。うっかり`Options`の定義を間違えてJSONには変換できないようなデータ、たとえば関数をプロパティにを加えてしまった場合は確実にコンパイルエラーが出ます。JavaScriptで`JSON.stringidy`とかを通すとJSONに変換できないデータは無視されるので、受け取った側でデータが欠落していてぎょっとすることがたまにありますが、そういうミスもコンパイル時に検知できます。

もっとも、型安全に取り扱えるような堅実な設計のJSONばかりではないでしょうし、`number`や`string`の両方を取りうるようなプロパティを持つJSONもあるでしょう。そういう静的型付けでは扱いにくいJSONを読み取るには、`Foreign`や`argonaut`を使ってプロパティをひとつひとつ丁寧に読み取っていくしかありません。



# JSONなWeb APIを叩く

手順は同じようなものですが、GithubのAPIを叩くサンプルも作ってみました。[以前の記事](http://qiita.com/hiruberuto/items/39e4126f470d8b84b291)のために書いたコードを流用したものです。

* https://github.com/aratama/example-followbox

簡単に手順をまとめてみます。

### 1. データ型を定義する

```haskell
newtype User = User {
    login :: String,
    avatar_url :: String,
    html_url :: String
}

type Users = Array User
```

### 2. `Generic`そのほかのインスタンスを自動導出あるいは自分で定義する

```haskell
instance isForeignUser :: IsForeign User where
    read = readGeneric defaultOptions { unwrapSingleConstructors = true }

derive instance genericUser :: Generic User _

instance showUser :: Show User where
    show = genericShow
```


### 3. Affjaxを使ってWeb APIを叩く非同期な作用を定義する

```haskell
fetchUsers :: forall eff. Int -> Aff (ajax :: AJAX | eff) Users
fetchUsers since = do
    res <- get $ "https://api.github.com/users?since=" <> show since
    liftEx $ read res.response

liftEx :: forall m e. (MonadError Error m, Show e) => ExceptT e Identity ~> m
liftEx = either (throwError <<< error <<< show) pure <<< runExcept
```

これだけです。なお、`read`の失敗を表現する型は`ExceptT`というデータ型なのですが、それに対して`Aff`の内部で使われているエラー表現の`err :: EXCEPTION`はJavaScriptの`Error`オブジェクトベースのものなので、実はエラーの内部的な表現が異なります。`liftEx`という補助的な関数は、`ExceptT`を`Aff`へと変換してこのギャップを埋め合わせるためのものです。

また、ネットワークの不調などで失敗することも多いと思いますが、エラーハンドリングをどうするべきかはアプリケーションによってまちまちなので、ここでは特に細かいエラーハンドリングはしていません。



# 型安全でない方法

なお、型安全でなくていいのなら[`unsafeFromForeign`](https://pursuit.purescript.org/packages/purescript-foreign/3.0.1/docs/Data.Foreign#v:unsafeFromForeign)を使うか、あるいはもっとワイルドに[`unsafeCoerce`](https://pursuit.purescript.org/packages/purescript-unsafe-coerce/2.0.0/docs/Unsafe.Coerce#v:unsafeCoerce)で型を変換してしまえばOKです。PureScriptのデータ型はJavaScriptのものとちゃんと対応しているので、実行時のデータがどうなっているのかちゃんと理解していれば問題なく動きます。そっちのほうが効率面でも有利です。




# さいごに

これでも動的型付けのプログラミング言語ならもっと簡単だと思うかもしれませんが、こういうオプションファイルを作ったらどんなオプションがあるのかドキュメントに書かなくてはいけませんから手間は結局同じことです。というかドキュメントに書いてもどうせ修正を忘れてコードとドキュメントの内容がズレ始めるに決まっているので、静的型付けの言語を使って型の定義として書いたほうがよほどマシです。

PureScriptのジェネリックプログラミングはまだHaskellほど強力ではないものの、最近のバージョンアップでジェネリックプログラミング関連の機能がどんどん追加されていてずいぶん便利になっています。それに伴って型レベルの計算も強力にサポートされるようになり、[型レベル計算でマップを実装する](https://github.com/LiamGoodacre/purescript-type-map/blob/master/src/Type/Map.purs)というような変態行為が可能なくらいにまでなっているみたいです。

なんか最近ほんとPureScriptのことしか書いていないです。firebaseとかvirtual-domとかWebGL/Babylonjsとか他にもお勧めしたいものはいろいろあるのですが、そっちは誰か他の人が紹介を書いてくれそうなので私はあんまり書く気がおきません。PureScriptはほんとにいいスクリプト言語なので、みんなもっと記事を書いてくれたらいいなと思います。アドベントカレンダーとか作ればよかったでしょうか。[TypeScriptのアドベントカレンダーすら過疎っている](http://qiita.com/advent-calendar/2016/typescript)し、PureScriptではもっと人が集まらないでしょうね……。

# 参考文献

* [Generic Programming](http://www.purescript.org/learn/generic/)
* [11. Generic Deriving - 24-days-of-purescript-2016](https://github.com/paf31/24-days-of-purescript-2016/blob/master/11.markdown) 24-days-of-purescript-2016でもちょうどジェネリックプログラミングの話題でした
* [AesonでJSONをパース・生成する方法まとめ](http://qiita.com/alpha22jp/items/4cc65f128962e11811fb) Haskellだとこんなかんじです
* https://github.com/purescript/purescript/issues/2416#issuecomment-266621928 ほんとはtypeにしたかったのですが、コンパイルが通らなかったのでnewtypeにしてます。これはバグかもしれません

