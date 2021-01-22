import { rgba } from "polished";
import { css, keyframes } from "styled-components";
import theme from "./theme";
const { colors, fontSizes } = theme;

const mixins = {
    flexCenter: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,

    flexBetween: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,

    engulf: css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
    `,

    outline: css`
        outline: 1px solid red;
    `,

    overflowEllipsis: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 1px;
    `,

    coverShadow: css`
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    `,

    button: css`
        display: inline-block;
        color: ${colors.white};
        font-weight: 700;
        font-size: ${fontSizes.xs};
        letter-spacing: 1px;
        /* text-transform: uppercase; */
        /* border: 1px solid ${colors.white}; */
        border-radius: 5px;
        padding: 11px 24px;
        cursor: pointer;
        transition: ${theme.transition};
        background-color: ${colors.lightMediumGrey};

        &:hover,
        &:focus {
            color: ${colors.black};
            background: ${colors.white};
            box-shadow: 0.1em 0.1em 0.5em ${rgba(colors.white, 0.5)};
            outline: 0;
        }
    `,

    buttonGhost: css`
        display: inline-block;
        color: ${colors.white};
        font-weight: 700;
        font-size: ${fontSizes.xs};
        letter-spacing: 1px;
        border: 1px solid ${colors.lightMediumGrey};
        border-radius: 5px;
        padding: 11px 24px;
        cursor: pointer;
        transition: ${theme.transition};

        &:hover,
        &:focus {
            color: ${colors.black};
            background: ${colors.white};
            outline: 0;
        }
    `,

    greenButton: css`
        display: inline-block;
        background-color: ${colors.green};
        color: ${colors.white};
        font-weight: 700;
        font-size: ${fontSizes.xs};
        letter-spacing: 1px;
        text-transform: uppercase;
        border-radius: 50px;
        padding: 11px 24px;
        margin: 20px 0;
        cursor: pointer;
        transition: ${theme.transition};

        &:hover,
        &:focus {
            background-color: ${colors.offGreen};
            outline: 0;
        }
    `,
    keyframes: {
        stroke: keyframes`
          52% {
              transform: rotate(-180deg);
              stroke-dashoffset: 0;
          }
          52.1% {
              transform: rotate(-360deg);
              stroke-dashoffset: 0;
          }
          100% {
              transform: rotate(-180deg);
              stroke-dashoffset: 126;
          }
        `,
        arrow: keyframes`
          0%,
          100% {
              transform: translateX(0);
              opacity: 1;
          }
          23% {
              transform: translateX(17px);
              opacity: 1;
          }
          24%,
          80% {
              transform: translateX(-22px);
              opacity: 0;
          }
          81% {
              opacity: 1;
              transform: translateX(-22px);
          }
      `,
        arrowUp: keyframes`
       0%,
        100% {
            transform: rotate(-40deg) scaleX(1);
        }
        20%,
        80% {
            transform: rotate(0deg) scaleX(0.1);
        }
      `,
        arrowDown: keyframes`
         0%,
        100% {
            transform: rotate(40deg) scaleX(1);
        }
        20%,
        80% {
            transform: rotate(0deg) scaleX(0.1);
        }
      `,
    },
};

export default mixins;
