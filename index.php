<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link rel="icon" type="image/png" href="res/images/icon.png"/>
    <link rel="stylesheet" href="res/css/bootstrap.min.css?v=alpha8"/>
    <link rel="stylesheet" href="res/css/bootstrap-theme.nav.css"/>
    <link rel="stylesheet" href="res/css/font-awesome.min.css?v=alpha8"/>
    <link rel="stylesheet" href="res/css/style.css?v=alpha8"/>
    <title>師大附中簡易成績查詢系統</title>
    
    <meta name="product" content="HSNU Grades Revised"/>
    <meta name="description" content="師大附中更簡便、更快速的新一代成績查詢系統。"/>
    <meta name="author" content="師大附中1296潘廣霖"/>
    <meta name="keywords" content="hsnugrades,hsnu,grade,score,成績,成績查詢系統"/>

    <meta property="og:title" content="師大附中成績查詢系統"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="http://hsnu.qov.tw/"/>
    <meta property="og:image" content="http://hsnu.qov.tw/res/images/logo.jpg"/>
    <meta property="og:site_name" content="師大附中簡易成績查詢系統"/>
    <meta property="og:description" content="師大附中更簡便、更快速的新一代成績查詢系統。"/>
    <meta property="fb:app_id" content="752537458152845"/>
    <meta property="fb:admins" content="1795479671"/>

    <!-- IE Really Sucks -->
    <!--[if lt IE 9]>
    <script src="res/js/html5shiv.min.js"></script>
    <![endif]-->
</head>
<body>

<div id="fb-root"></div>

<div id="navbar" class="navbar navbar-default shadow navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-main-navbar-collapse">
                <span class="sr-only">開關導覽列</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            
            <a class="navbar-brand active" href="#">
                HSNU-Grades <sub class="fill-version-full">ver. α-8</sub>
            </a>
        </div>
        <div class="collapse navbar-collapse" id="bs-main-navbar-collapse">
            <ul class="nav navbar-nav">
                <!--<li><a href="#"><i class="fa fa-fw fa-paper-plane"></i> 基本資料</a></li>
                <li class="divider-vertical hidden-xs"></li>
                <li><a href="#"><i class="fa fa-fw fa-paper-plane"></i> 學期成績</a></li>
                <li class="divider-vertical hidden-xs"></li>
                <li><a href="#"><i class="fa fa-fw fa-paper-plane"></i> 單次考試成績</a></li>
                <li class="divider-vertical hidden-xs"></li>
                <li><a href="#"><i class="fa fa-fw fa-paper-plane"></i> 成績總覽</a></li>
                <li class="divider-vertical hidden-xs"></li>-->
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <!-- <li class=""><a href="#"><i class="fa fa-fw fa-refresh"></i> 重整</a></li> -->
                <!-- <li class="divider-vertical"></li> -->
                <li>
                    <a id="userInfoBtn" href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-user fa-lg"></i>&nbsp;<span>[未登入]</span>&nbsp;<i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- <li><a tabindex="-1" href="#">更新紀錄</a></li> -->
                        <!-- <li><a tabindex="-1" href="#">關於</a></li> -->
                        <li><a id="logoutBtn" tabindex="-1" href="#"><i class="fa fa-fw fa-sign-out"></i>登出</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
 </div>

<div id="banner"><div class="container">
    <div class="row">
        <div class="col-md-6 col-sm-12 col-md-offset-1">
            <header>
            <h1 id="title">
                <img id="logo" src="res/images/logo.png"/>
                師大附中簡易成績查詢系統
            </h1>
            <p>重新排版的成績查詢系統！目標是使查詢成績的流程更加方便直覺、簡便易用！</p>
            <hr/>
            </header>
            <!--<aside style="background-color: #900; color: #fff; height: 150px; overflow: hidden; cursor: default; padding-left: 1em;">
                <img src="res/images/hsnu-capture.png" style="height: 225px;" class="pull-right"/>
                <div class="h1" style="padding-top: 15px;">嚴正譴責抄襲。</div>
                <p style="font-size: 120%;">對於校網上相似介面的網頁服務感到痛心。</p>
                <p class="text-right">2014/11/19&nbsp;</p>
            </aside>-->
        </div>
        <div class="col-md-4 col-xs-12 col-md-pull-1 pull-right">
            <aside id="loginPanel" class="panel panel-default paper-z-1">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fa fa-paper-plane"></i>&nbsp;登入</h3>
                </div>
                <div class="panel-body">
                    <div id="loginMsg" class="alert-hide"></div>
                    <form id="loginForm">
                        <div class="form-group">
                            <div class="input-group input-group-lg">
                                <span class="input-group-addon">帳號</span>
                                <input type="text" class="form-control" id="loginId" placeholder="學號"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group input-group-lg">
                                <span class="input-group-addon">密碼</span>
                                <input type="password" class="form-control" id="loginPwd" placeholder="身分證字號"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <input type="number" class="form-control" id="loginCaptcha" placeholder="驗證碼" autocomplete="off"/>
                                <span class="captcha-container input-group-addon">
                                    <img id="captchaImage"/>
                                </span>
                            </div>
                            <span class="help-block text-right"><i class="fa fa-repeat"></i>&nbsp;看不清楚嗎？<a id="captchaRenew" href="#">換一張</a>。</span>
                        </div>
                        <button id="loginBtnProxy" type="submit" class="hidden">送出</button>
                    </form>
                </div>
                <div class="panel-footer">
                    <button type="button" id="loginBtn" class="btn btn-primary pull-right">登入 &raquo;</button>
                    <span class="checkbox">
                        <label><input id="loginRememberMe" type="checkbox"/>&nbsp;<span class="text-medium"><i class="fa fa-link"></i>&nbsp;記住帳號</span></label>
                    </span>
                </div>
            </aside>
            <section class="well well-sm">
                <h4>關於隱私</h4>
                <p>
                    <strong>本網頁之個資與成績資料皆來自<a href="http://grades.hs.ntnu.edu.tw/online/">學校的查詢系統</a></strong>，但若有出入以學校網頁為準。由於本網頁不是架在學校伺服器上，而是使用虛擬主機的免費方案，若覺得對隱私有疑慮，請勿登入，或改用<a href="http://andy0130tw.droppages.com/score">另一個同樣是我開發的系統</a>。
                </p>
                <p id="HTTPWarning" class="hide">
                    <strong>學校系統本來就沒有安全連線(SSL)保護</strong>，若欲使用加密連線，請<a href="https://hsnu.qov.tw/">啟用HTTPS(會有警告是正常現象)</a>，並檢查<a href="javascript:alert(CERT_SHA1_FP)">SHA1 Fingerprint</a>是否一致。
                </p>
                <p id="HTTPSWarning" class="hide">
                    <strong>建議您檢查<a href="javascript:alert(CERT_SHA1_FP)">SHA1 Fingerprint</a>是否與憑證一致。</strong>
                </p>
            </section>
        </div>
        <div class="clearfix visible-xs-block visible-sm-block"></div>
        <div class="col-md-6 col-md-offset-1">
            <div class="row">
                <section class="col-sm-6">
                    <h3><i class="fa fa-fw fa-desktop"></i>&nbsp;支援主流瀏覽器</h3>
                    <p class="lead">解決了原本網頁在非IE瀏覽器的異狀，手機瀏覽器也可以正常瀏覽！</p>
                </section>
                <section class="col-sm-6">
                    <h3><i class="fa fa-fw fa-magic"></i>&nbsp;介面更為直覺</h3>
                    <p class="lead">將所有資料查詢的介面整理成單一網頁，能夠快速找到想要的資訊！</p>
                </section>
                <section class="col-sm-6">
                    <h3><i class="fa fa-fw fa-align-left"></i>&nbsp;一目瞭然</h3>
                    <p class="lead">不必再從密密麻麻的數字裡面找東西了！</p>
                </section>
                <section class="col-sm-6">
                    <h3><i class="fa fa-fw fa-print"></i>&nbsp;友善列印</h3>
                    <p class="lead">把整個網頁印下來，還是保持漂漂亮亮！</p>
                </section>
            </div>
            <div class="row">
                <section class="col-md-12 col-sm-6 facebook-container">
                    <div class="fb-like" data-href="http://hsnu.qov.tw/" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" data-font="segoe ui"></div>
                </section>
            </div>
        </div>
    </div>
</div></div>

<div id="root" class="container">
</div>

<div id="subContent" class="container">
    <!--<div class="row">
        <div class="col-md-12">
         <h2><i class="fa fa-fw fa-rss"></i>最新消息</h2>
        </div>
    </div>-->
    <section class="row post-collection">
        <!--<div class="col-md-12">
           
            <article class="post col-md-4 col-sm-6">
                <h3 class="post-title">Alpha 2</h3>
                <ol>
                    <li>閒置時間太久而無法登入時提示使用者</li>
                    <li>修正版面配置</li>
                    <li>修正登入不明失敗而必須重新整理的bug</li>
                </ol>
                <p class="post-author">by Andy~★, 2014-10-15</p>
            </article>
            <article class="post col-md-4 col-sm-6">
                <h3 class="post-title">網頁公開測試</h3>
                <p>這個網頁從2014/10/10開始製作，現在開放公開測試。</p>
                <p class="post-author">by Andy~★, 2014-10-10</p>
            </article>
            <article class="post col-md-4 col-sm-6">
                <h3 class="post-title">測試貼文</h3>
                <p>這裡現在是靜態更新，之後會改用PHP+SQLite實作。</p>
                <p class="post-author">by Admin, 2014-10-10</p>
            </article>
                
        </div>-->
        <!-- <div class="col-md-12">
            <article class="post col-md-4 col-sm-6">
                <h3 class="post-title">Test Article</h3>
                <p>Hello, world.</p>
                <p class="post-author">by Admin, 2014-10-10</p>
            </article>
        </div> -->
    </section>
    
    <section class="row">
        <div  class="col-md-8">
            <h2><i class="fa fa-fw fa-comments-o"></i>留言板</h2>
            <p>鼓勵、批評、功能建議等等，歡迎在這裡留下。</p>
            <div id="disqus_thread"></div>
            <!-- START: Livefyre Embed -->
            <!--<div id="livefyre-comments"></div>
            <script type="text/javascript" src="http://zor.livefyre.com/wjs/v3.0/javascripts/livefyre.js"></script>
            <script type="text/javascript">
            (function () {
                if(typeof fyre=="undefined")return;
                var articleId = fyre.conv.load.makeArticleId(null);
                fyre.conv.load({}, [{
                    el: 'livefyre-comments',
                    network: "livefyre.com",
                    siteId: "366224",
                    articleId: articleId,
                    signed: false,
                    collectionMeta: {
                        articleId: articleId,
                        url: fyre.conv.load.makeCollectionUrl(),
                    }
                }], function() {});
            }());
            </script>-->
            <!-- END: Livefyre Embed -->
            <noscript>Please enable JavaScript to view the comments.</noscript>
        </div>
        <div class="col-md-4">
            <aside id="asideLinks" class="list-group">
                <div class="list-group-item list-group-item disabled">
                    <h4 class="list-group-item-heading">
                        <i class="fa fa-fw fa-share"></i>連結
                    </h4>
                </div>
                <a href="http://crc.hs.ntnu.edu.tw/~lsc36/hsnugrades/" class="list-group-item list-group-item-warning">
                    <h4 class="list-group-item-heading">
                        <i class="fa fa-fw fa-certificate"></i>&nbsp;向第一個改良版成績查詢系統致敬！
                    </h4>
                </a>
                <a href="/schedule/" class="list-group-item list-group-item-warning">
                    <h4 class="list-group-item-heading">
                        <i class="fa fa-fw fa-certificate"></i>&nbsp;來試試課表查詢系統！
                    </h4>
                </a>
                <a href="http://twitter.com/andy0130tw" class="list-group-item">
                    <i class="fa fa-fw fa-twitter-square"></i>&nbsp;Twitter @andy0130tw
                </a>
                <a href="http://andy0130tw.blogspot.tw/" class="list-group-item">
                    <i class="fa fa-fw fa-th-large"></i>&nbsp;My Blog
                </a>
                <div class="list-group-item list-group-item disabled">
                    <h4 class="list-group-item-heading">
                        <i class="fa fa-fw fa-book"></i>&nbsp;關於
                    </h4>
                </div>
                <div class="list-group-item list-group-item list-group-item-info">
                    <h4 class="list-group-item-heading">
                        粉絲專頁
                    </h4>
                    <span class="list-group-item-text">
                        <div class="fb-like-box" data-href="https://facebook.com/hsnugrades" 
                            data-colorscheme="light" data-show-faces="true" data-header="false" 
                            data-stream="true" data-show-border="true"></div>
                    </span>
                </div>
                <div class="list-group-item list-group-item">
                    <h4 class="list-group-item-heading">
                        製作緣起
                    </h4>
                    <span class="list-group-item-text">
                        本網頁始於2014/10/10，作者在高中時，覺得學校的成績查詢系統有點難用，<!--
                        -->加上行動裝置不能查成績，再加上限定瀏覽器、限定版本的網頁本應被淘汰，<!--
                        -->於是開發了這套簡易查詢系統。<br/><!--
                        -->學校網頁上的那個「簡易查詢」，是此系統的仿製，作者另有其人。
                    </span>
                </div>
            </aside>
        </div>
    </section>
</div>

<footer id="footer" class="container">
    <hr/>
    <div class="text-light">
        <div class="pull-left">HSNU-Grades ver. Alpha&mdash; &copy; Andy Pan, 2014-2015.</div>
        <div class="pull-right">師大附中 1296 班</div>
    </div>
</footer>

<script src="res/js/jquery.min.js"></script>
<script src="res/js/jquery.cookie.min.js"></script>
<script src="res/js/bootstrap.min.js"></script>
<script src="res/js/underscore.min.js"></script>
<script src="res/js/backbone.min.js"></script>
<script src="res/js/respond.js"></script>
<script src="res/js/adapters.js"></script>
<script src="res/js/main.js?v=alpha8"></script>
<script src="res/js/main.scorelist.js?v=alpha8"></script>

<script>
window.fbAsyncInit=function(){FB.init({appId:"752537458152845",xfbml:!0,version:"v2.1"})},
function(e,n,t){var o,c=e.getElementsByTagName(n)[0];
e.getElementById(t)||(o=e.createElement(n),o.id=t,o.src="//connect.facebook.net/zh_TW/sdk.js",
c.parentNode.insertBefore(o,c))}(document,"script","facebook-jssdk");

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-60002659-1', 'auto');
  ga('send', 'pageview');

CERT_SHA1_FP="A9:2F:3A:8A:AA:94:DE:9E:39:96:B8:C1:03:3B:E0:88:9A:F4:51:4F";
</script>

</body>
</html>