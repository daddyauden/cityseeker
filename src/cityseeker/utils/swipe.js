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

function isHorizontalSwipe(gestureState) {
    const {vx, dy} = gestureState;

    const {velocityThreshold, directionalOffsetThreshold} = swipeConfig;

    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
}

function isVerticalSwipe(gestureState) {
    const {vy, dx} = gestureState;

    const {velocityThreshold, directionalOffsetThreshold} = swipeConfig;

    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
}

function isLeftSwipe(gestureState) {
    const {dx} = gestureState;

    if (_isValidHorizontalSwipe(gestureState)) {
        return dx > 0 ? false : true;
    }

    return null;
}

function isRightSwipe(gestureState) {
    const {dx} = gestureState;

    if (_isValidHorizontalSwipe(gestureState)) {
        return dx > 0 ? true : false;
    }

    return null;
}

function isUpSwipe(gestureState) {
    const {dy} = gestureState;

    if (isVerticalSwipe(gestureState)) {
        return dy > 0 ? false : true;
    }

    return null;
}

function isDownSwipe(gestureState) {
    const {dy} = gestureState;

    if (isVerticalSwipe(gestureState)) {
        return dy > 0 ? true : false;
    }

    return null;
}

function IsClick(gestureState) {
    return (
        Math.abs(gestureState.dx) < swipeConfig.gestureIsClickThreshold &&
        Math.abs(gestureState.dy) < swipeConfig.gestureIsClickThreshold
    );
}

function isSingleSwipe(evt, gestureState) {
    return evt.nativeEvent.touches.length === 1 && !IsClick(gestureState);
}

export {
    isSingleSwipe,
    isLeftSwipe,
    isRightSwipe,
    isUpSwipe,
    isDownSwipe,
    isHorizontalSwipe,
    isVerticalSwipe,
};
