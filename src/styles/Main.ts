import styled from "styled-components";
import media from "./media";
import theme from "./theme";

const Main = styled.main`
    width: 100%;
    margin: 0 auto;
    max-width: 1400px;
    min-height: 100vh;
    padding: 40px 80px 80px 80px;
    background-color: ${theme.colors.lightBlack};
    padding-top: 100px;
    ${media.desktop`
    padding: 60px 50px;
    padding-top: 100px;
  `};
    ${media.tablet`
    padding: 50px 40px;
  `};
    ${media.phablet`
    padding: 30px 25px;
  `};
    h2 {
        ${media.tablet`
      text-align: center;
    `};
    }
`;

export default Main;
