export const parseQuery = query => {
    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            const [key, value] = param.split('=');
            params[key] = value
                ? decodeURIComponent(value.replace(/\+/g, ' '))
                : '';
            return params;
        }, {});
};

export const parseDeepLinking = url => {
    if (url) {
        url = url.replace(
            /cityseeker:\/\/|lingchat:\/\/|https:\/\/www.daddyauden.com/,
            '',
        );
        const regex = /^(feed|room|business|user|events|item|job)\?/;
        if (url.match(regex)) {
            url = url.replace(regex, '').trim();
            if (url) {
                return parseQuery(url);
            }
        }
    }

    return null;
};
