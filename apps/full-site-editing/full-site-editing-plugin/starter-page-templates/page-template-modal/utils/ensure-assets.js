/**
 * External dependencies
 */
import { reduce, isEmpty, forEach, set } from 'lodash';

const addAssetToLoad = ( assets, url, usages ) => {
	// Use an existing asset for the URL or make a new one.
	const asset = assets[ url ] || {
		url,
		usages: [],
	};

	// Return new result object, extended with the new/updated asset.
	return {
		...assets,
		[ url ]: {
			...asset,
			// Store where exactly block uses id/url so we can update it later.
			usages: [ ...asset.usages, ...usages ],
		},
	};
};

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
				result.assets = addAssetToLoad( result.assets, url, [
					{ prop: 'url', path: [ block.clientId, 'attributes', 'url' ] },
					{ prop: 'id', path: [ block.clientId, 'attributes', 'id' ] },
				] );
			}
		}
		case 'core/media-text': {
			const url = block.attributes.mediaUrl;
			if ( url && block.attributes.mediaType === 'image' ) {
				result.assets = addAssetToLoad( result.assets, url, [
					{ prop: 'url', path: [ block.clientId, 'attributes', 'mediaUrl' ] },
					{ prop: 'id', path: [ block.clientId, 'attributes', 'mediaId' ] },
				] );
			}
		}
		case 'core/gallery': {
			forEach( block.attributes.images, ( image, i ) => {
				result.assets = addAssetToLoad( result.assets, image.url, [
					{ prop: 'url', path: [ block.clientId, 'attributes', 'images', i, 'url' ] },
					{ prop: 'url', path: [ block.clientId, 'attributes', 'images', i, 'link' ] },
					{ prop: 'id', path: [ block.clientId, 'attributes', 'images', i, 'id' ] },
					{ prop: 'id', path: [ block.clientId, 'attributes', 'ids', i ] },
				] );
			} );
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
			const mockImage = {
				id: 66,
				url: 'http://test.local/wp-content/uploads/2019/07/Screenshot-2019-07-16-at-17.30.52-1021x1024.png',
			};

			detectedAssets.fetched = reduce( detectedAssets.assets, ( fetched, asset ) => ( {
				...fetched,
				[ asset.url ]: mockImage,
			} ), {} );

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
			console.log( 'asset not present, skipping usages' );
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
