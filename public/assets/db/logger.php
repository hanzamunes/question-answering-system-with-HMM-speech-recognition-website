<?php
	if (!defined('BASE')) die('<h1 class="try-hack">Restricted access!</h1>');
	

	function Connect($stat){
		$db = new Database();
		$ip = getenv ("REMOTE_ADDR");
		$requri = getenv ("REQUEST_URI");
		$servname = getenv ("SERVER_NAME");
		$combine = $servname . $requri ;
		$httpref = getenv ("HTTP_REFERER");
		$httpagent = getenv ("HTTP_USER_AGENT");
		$today = date("D M j Y g:i:s a");
		$query = "";
		switch ($stat) {
			case '0':
				# ERROR code...
				$query = "INSERT INTO `leopisan_logs`.`log` (`IDX`, `IP`, `ACCESS_TYPE`, `URL`, `TIME`) VALUES (NULL, '".$ip."', 'Error', '".$combine."', CURRENT_TIMESTAMP)";
				break;
			
			default:
				# SUCCESS code...
				$query = "INSERT INTO `leopisan_logs`.`log` (`IDX`, `IP`, `ACCESS_TYPE`, `URL`, `TIME`) VALUES (NULL, '".$ip."', 'Connect', '".$combine."', CURRENT_TIMESTAMP)";
				break;
		}
		$res = $db->queryddl($query);
		return $res;
	}
	
?>