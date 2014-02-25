<?php

ini_set('safe_mode', false);
@header("Content-Type: text/html; charset=utf-8");
@header("Cache-Control: no-cache, must-revalidate");
@header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

$jsonheader = array('Accept: application/json', 'Content-Type: application/json');
$url = 'http://api.lojaintegrada.com.br/api/v1/produto/';
$id = ($_POST['id']);
$url_fix = $url . $id;
$metod = ($_POST['metod']);
$data = json_encode($_POST['data']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, $jsonheader);
curl_setopt($ch, CURLOPT_URL, $url_fix);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $metod);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
$response = curl_exec($ch);
$header = curl_getinfo( $ch );
curl_close($ch);

print_r($response);

?>