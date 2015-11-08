wpApp.factory('Users', function($resource) {
	return $resource(APIdata.api_url + '/sg_users/:id?_wp_json_nonce=' + APIdata.api_nonce, {
		id: '@id'
	}, 
	{
		DELETE : {
			method: 'DELETE',
			url: APIdata.api_url + '/users/:id?_wp_json_nonce=' + APIdata.api_nonce,
			params: { id: '@id' }
		}
	});
	
});

wpApp.factory('StyleGuides', function($resource) {
	return $resource(APIdata.api_url + '/posts/:id?_wp_json_nonce=' + APIdata.api_nonce + '&type[]=style-guides', {
		id: '@id'
	}, {
		update: {
			method: 'PUT'
		}
	});
});