/** @format */

/**
 * External dependencies
 */

import { filter } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ControlItem from 'components/segmented-control/item';
import { handleKeyEvent, getCurrentFocusedIndex, getSiblingIndex } from './utilities';

export default class SegmentedControl extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		compact: PropTypes.bool,
		onSelect: PropTypes.func,
		style: PropTypes.object,
	};
	static defaultProps = { compact: false };
	itemRefs = [];
	focused = null;

	/**
	 * Allows for keyboard navigation
	 * @param  {String} direction - `next` or `previous`
	 * @return {Number|Boolean} - returns false if the newIndex is out of bounds
	 */
	focusSibling = direction => {
		typeof this.focused !== 'number' && this.setCurrentFocusIndex();
		const items = filter( this.props.children, item => item.type === ControlItem );
		const newIndex = getSiblingIndex( items, direction );
		if ( newIndex ) {
			this.itemRefs[ newIndex ].focusItemLink();
			this.setCurrentFocusIndex( newIndex );
		}
		return newIndex;
	};

	setCurrentFocusIndex( index = getCurrentFocusedIndex() ) {
		this.focused = index;
	}

	createChildRef( child, index ) {
		return child.type === ControlItem ? ref => ( this.itemRefs[ index ] = ref ) : null;
	}

	getSegmentedItems = () => {
		let refIndex = 0;
		// add keys and refs to children
		return React.Children.map( this.props.children, ( child, index ) => {
			const newChild = React.cloneElement( child, {
				ref: this.createChildRef( child, refIndex ),
				key: index,
				onClick: event => {
					this.setState( { keyboardNavigation: false }, () => {
						typeof child.props.onClick === 'function' && child.props.onClick( event );
					} );
				},
			} );

			if ( child.type === ControlItem ) {
				refIndex += 1;
			}

			return newChild;
		} );
	};

	render() {
		const segmentedClasses = {
			'keyboard-navigation': this.state.keyboardNavigation,
			'is-compact': this.props.compact,
			'is-primary': this.props.primary,
		};

		return (
			<ul
				className={ classNames( 'segmented-control', segmentedClasses, this.props.className ) }
				style={ this.props.style }
				role="radiogroup"
				onKeyDown={ handleKeyEvent( this.focusSibling ) }
				onKeyUp={ () => this.setState( { keyboardNavigation: true } ) }
			>
				{ this.getSegmentedItems() }
			</ul>
		);
	}
}
