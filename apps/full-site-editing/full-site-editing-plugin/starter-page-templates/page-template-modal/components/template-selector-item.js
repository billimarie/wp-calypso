/**
 * External dependencies
 */
import { throttle } from 'lodash';

/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import { useMemo, useRef, useLayoutEffect, useState } from '@wordpress/element';
import { parse as parseBlocks } from '@wordpress/blocks';
import { BlockPreview } from '@wordpress/block-editor';

const TemplateSelectorItem = props => {
	const {
		id,
		value,
		help,
		onFocus,
		onSelect,
		label,
		rawBlocks,
		dynamicPreview = false,
		preview,
		previewAlt = '',
		blocksInPreview,
	} = props;

	const itemRef = useRef( null );
	const [ dynamicCssClasses, setDynamicCssClasses ] = useState( 'is-rendering' );

	const blocks = useMemo( () => {
		if ( ! dynamicPreview ) {
			return [];
		}

		const parsedBlocks = parseBlocks( rawBlocks );
		if ( blocksInPreview ) {
			return parsedBlocks.slice( 0, blocksInPreview );
		}

		return parsedBlocks;

	}, [ rawBlocks, blocksInPreview, dynamicPreview ] );

	useLayoutEffect( () => {
		const timerId = setTimeout( () => {
			const el = itemRef ? itemRef.current : null;

			if ( ! el ) {
				setDynamicCssClasses( '' );
				return;
			}

			// Try to pick up the editor styles wrapper element.
			// And move the `.editor-styles-wrapper` class out of the preview.
			const editorStylesWrapperEl = el.querySelector( '.editor-styles-wrapper' );
			if ( editorStylesWrapperEl ) {
				setTimeout( () => {
					editorStylesWrapperEl.classList.remove( 'editor-styles-wrapper' );
				}, 0 );
				setDynamicCssClasses( 'editor-styles-wrapper' );
			}
		}, 0 );

		// Cleanup
		return () => {
			if ( timerId ) {
				window.clearTimeout( timerId );
			}
		};
	}, [ blocks ] );

	const innerPreview = dynamicPreview ? (
		<div ref={ itemRef } className={ dynamicCssClasses }>
			{ blocks && blocks.length ? <BlockPreview blocks={ blocks } viewportWidth={ 800 } /> : null }
		</div>
	) : (
		<img className="template-selector-item__media" src={ preview } alt={ previewAlt } />
	);

	return (
		<button
			type="button"
			id={ `${ id }-${ value }` }
			className="template-selector-item__label"
			value={ value }
			onClick={ () =>
				onSelect( value, label, ( blocksInPreview || ! dynamicPreview ) ? parseBlocks( rawBlocks ) : blocks )
			}
			onMouseEnter={ throttle( () =>
				onFocus( value, label, dynamicPreview ? blocks : parseBlocks( rawBlocks ) )
			, 300) }
			aria-describedby={ help ? `${ id }__help` : undefined }
		>
			<div className="template-selector-item__preview-wrap">{ innerPreview }</div>
			{ label }
		</button>
	);
};

export default TemplateSelectorItem;
