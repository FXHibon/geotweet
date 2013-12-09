<?php

 //1 - Settings (please update to math your own)
$consumer_key = '8T08nPrFpbAIEZQTCUUT4Q'; //Provide your application consumer key
$consumer_secret = 'hyA7ySm6WAZGkT8WXfoeLMUb0P0jOx90ss3drSIiA'; //Provide your application consumer secret
$oauth_token = '1673697182-6zo9eruttYz27WzbqXFs7bVCTmprdEK8bV9NNJ7'; //Provide your oAuth Token
$oauth_token_secret = 'fQMWotTlF8Md5jaLRRrGDzzjC3jAcsoeggPFW7F741UFF'; //Provide your oAuth Token Secret

//2 - Include @abraham's PHP twitteroauth Library
require_once('twitteroauth/twitteroauth.php');
//3 - Authentication
/* Create a TwitterOauth object with consumer/user tokens. */
$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_token, $oauth_token_secret);


if(isset($_GET["twitter_query"])) {
	$url = $_GET["twitter_query"];
	echo json_encode($connection->get($url));
} else {
	echo "{}";
}

?>