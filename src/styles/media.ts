import { css } from "styled-components";

const sizes = {
    giant: 1440,
    desktop: 1200,
    netbook: 1000,
    tablet: 768,
    thone: 600,
    phablet: 480,
    phone: 376,
    tiny: 330,
};

// iterate through the sizes and create a media template
export const media = (Object.keys(sizes) as (keyof typeof sizes)[]).reduce<
    Partial<{ [K in keyof typeof sizes]: any }>
>((accumulator, label: keyof typeof sizes) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const emSize = sizes[label] / 16;
    accumulator[label] = (...args: any) => css`
        @media (max-width: ${emSize}em) {
            ${(css as any)(...args)};
        }
    `;
    return accumulator;
}, {}) as { [K in keyof typeof sizes]: any };

export default media;
