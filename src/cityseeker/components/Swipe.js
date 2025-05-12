import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, PanResponder} from 'react-native';

export const swipeDirections = {
    SWIPE_UP: 'SWIPE_UP',
    SWIPE_DOWN: 'SWIPE_DOWN',
    SWIPE_LEFT: 'SWIPE_LEFT',
    SWIPE_RIGHT: 'SWIPE_RIGHT',
};

const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    gestureIsClickThreshold: 5,
};

function isValidSwipe(
    velocity,
    velocityThreshold,
    directionalOffset,
    directionalOffsetThreshold,
) {
    return (
        Math.abs(velocity) > velocityThreshold &&
        Math.abs(directionalOffset) < directionalOffsetThreshold
    );
}

class Default extends Component {
    _gestureIsClick(gestureState) {
        return (
            Math.abs(gestureState.dx) < swipeConfig.gestureIsClickThreshold &&
            Math.abs(gestureState.dy) < swipeConfig.gestureIsClickThreshold
        );
    }

    _handleShouldSetPanResponder(evt, gestureState) {
        return (
            evt.nativeEvent.touches.length === 1 &&
            !this._gestureIsClick(gestureState)
        );
    }

    _isValidHorizontalSwipe(gestureState) {
        const {vx, dy} = gestureState;

        const {
            velocityThreshold,
            directionalOffsetThreshold,
        } = this.swipeConfig;

        return isValidSwipe(
            vx,
            velocityThreshold,
            dy,
            directionalOffsetThreshold,
        );
    }

    _isValidVerticalSwipe(gestureState) {
        const {vy, dx} = gestureState;

        const {
            velocityThreshold,
            directionalOffsetThreshold,
        } = this.swipeConfig;

        return isValidSwipe(
            vy,
            velocityThreshold,
            dx,
            directionalOffsetThreshold,
        );
    }

    _getSwipeDirection(gestureState) {
        const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN} = swipeDirections;

        const {dx, dy} = gestureState;

        if (this._isValidHorizontalSwipe(gestureState)) {
            return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
        } else if (this._isValidVerticalSwipe(gestureState)) {
            return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
        }
        return null;
    }

    _triggerSwipeHandlers(swipeDirection, gestureState) {
        const {
            onSwipe,
            onSwipeUp,
            onSwipeDown,
            onSwipeLeft,
            onSwipeRight,
        } = this.props;

        const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN} = swipeDirections;

        onSwipe && onSwipe(swipeDirection, gestureState);

        switch (swipeDirection) {
            case SWIPE_LEFT:
                onSwipeLeft && onSwipeLeft(gestureState);
                break;
            case SWIPE_RIGHT:
                onSwipeRight && onSwipeRight(gestureState);
                break;
            case SWIPE_UP:
                onSwipeUp && onSwipeUp(gestureState);
                break;
            case SWIPE_DOWN:
                onSwipeDown && onSwipeDown(gestureState);
                break;
        }
    }

    _handlePanResponderEnd(evt, gestureState) {
        const swipeDirection = this._getSwipeDirection(gestureState);

        this._triggerSwipeHandlers(swipeDirection, gestureState);
    }

    constructor(props) {
        super(props);
        this.swipeConfig = swipeConfig;

        const shouldSetResponder = this._handleShouldSetPanResponder.bind(this);
        const responderEnd = this._handlePanResponderEnd.bind(this);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: shouldSetResponder,
            onMoveShouldSetPanResponder: shouldSetResponder,
            onPanResponderRelease: responderEnd,
            onPanResponderTerminate: responderEnd,
        });
    }

    render() {
        return (
            <View {...this._panResponder.panHandlers} {...this.props}>
                {this.props.children}
            </View>
        );
    }
}

Default.propTypes = {
    onSwipeLeft: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipteUp: PropTypes.func,
    onSwipeDown: PropTypes.func,
};

export default Default;
