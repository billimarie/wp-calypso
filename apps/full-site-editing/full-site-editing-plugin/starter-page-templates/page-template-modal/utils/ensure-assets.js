/**
 * External dependencies
 */
import { reduce, isEmpty, forEach, set } from 'lodash';

const findAssets = ( result, block ) => {
	result.blocksByClientId[ block.clientId ] = block;

	// Identify assets in blocks where we expect them.
	switch ( block.name ) {
		// Both of these blocks use same attribute names for image id and url
		// and thus we can share the implementation.
		case 'core/cover':
		case 'core/image': {
			const url = block.attributes.url;
			if ( url ) {
				// Add assets to the fetch list if it's not there yet.
				if ( ! result.assets[ url ] ) {
					result.assets[ url ] = {
						url,
						usages: [],
					};
				}

				// Store where exactly block uses id/url so we can update it later.
				result.assets[ url ].usages.push( {
					prop: 'url',
					path: [ block.clientId, 'attributes', 'url' ],
				} );
				result.assets[ url ].usages.push( {
					prop: 'id',
					path: [ block.clientId, 'attributes', 'id' ],
				} );
			}
		}
	}

	// Recursively process all inner blocks.
	if ( ! isEmpty( block.innerBlocks ) ) {
		return reduce( block.innerBlocks, findAssets, result );
	}

	return result;
};

const fetchAssets = async detectedAssets => {
	return new Promise( resolve => {
		// Simulate API call delay.
		setTimeout( () => {
			// TODO: Get this from API response.
			detectedAssets.fetched = {
				'https://a8ctm1.files.wordpress.com/2019/06/a4650-9f31c-743c3-20ca2-fair-1.jpg?w=640': {
					id: 123,
					url:
						'https://a8ctm1.files.wordpress.com/2019/06/a4650-9f31c-743c3-20ca2-fair-1.jpg?w=640',
				},
				'https://a8ctm1.files.wordpress.com/2019/06/ec3b1-91d42-39015-a1d6d-horses.jpg?w=640': {
					id: 456,
					url:
						'https://a8ctm1.files.wordpress.com/2019/06/ec3b1-91d42-39015-a1d6d-horses.jpg?w=640',
				},
				'https://a8ctm1.files.wordpress.com/2019/06/39f29-4071c-052ef-71bb0-car.jpg?w=640': {
					id: 789,
					url: 'https://a8ctm1.files.wordpress.com/2019/06/39f29-4071c-052ef-71bb0-car.jpg?w=640',
				},
			};
			resolve( detectedAssets );
		}, 1000 );
	} );
};

const getBlocksWithAppliedAssets = detectedAssets => {
	forEach( detectedAssets.assets, asset => {
		console.log( 'processing asset', asset );
		const newAsset = detectedAssets.fetched[ asset.url ];
		console.log( 'was fetched as', newAsset );
		if ( ! newAsset ) {
			console.log('asset not present, skipping usages');
			return;
		}
		forEach( asset.usages, usage => {
			console.log( usage.prop, 'used in', usage.path );
			set( detectedAssets.blocksByClientId, usage.path, newAsset[ usage.prop ] );
		} );
	} );

	return detectedAssets.blocks;
};

const ensureAssets = async blocks => {
	const detectedAssets = reduce( blocks, findAssets, {
		assets: {},
		blocksByClientId: {},
		blocks,
	} );

	console.log( detectedAssets );

	// No assets found. Proceed with insertion right away.
	if ( isEmpty( detectedAssets.assets ) ) {
		return blocks;
	}

	// Ensure assets are available on the site and replace originals
	// with local copies before inserting the template.
	return fetchAssets( detectedAssets ).then( getBlocksWithAppliedAssets );
};

export default ensureAssets;
