export default {
    resetPassword(user) {
        // RC 0.48.0
        return this.sdk.post('users.resetPassword', user);
    },
    updateUser(userId, data, customFields) {
        return this.sdk.post('users.update', {
            userId,
            data,
            customFields,
        });
    },
};
