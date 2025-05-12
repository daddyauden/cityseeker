import React from 'react';
import {View, Modal as LModal, TouchableWithoutFeedback} from 'react-native';

class Modal extends React.Component {
    renderHeader() {
        const {style, renderHeader} = this.props;

        return <View style={style.header}>{renderHeader()}</View>;
    }

    renderContent() {
        const {style, renderContent} = this.props;

        return <View style={style.content}>{renderContent()}</View>;
    }

    renderFooter() {
        const {style, renderFooter} = this.props;

        return <View style={style.footer}>{renderFooter()}</View>;
    }

    render() {
        const {
            transparent,
            animationType,
            visible,
            style,
            onDismiss,
            renderHeader,
            renderContent,
            renderFooter,
        } = this.props;

        return (
            <LModal
                visible={visible ? visible : false}
                transparent={transparent ? transparent : true}
                animationType={animationType ? animationType : 'slide'}
                onDismiss={onDismiss ? onDismiss : () => {}}>
                <TouchableWithoutFeedback
                    onPress={() => onDismiss && onDismiss()}>
                    <View style={style.container}>
                        {renderHeader ? this.renderHeader() : null}
                        {renderContent ? this.renderContent() : null}
                        {renderFooter ? this.renderFooter() : null}
                    </View>
                </TouchableWithoutFeedback>
            </LModal>
        );
    }
}

export default Modal;
