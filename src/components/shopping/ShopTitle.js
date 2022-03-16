import React from "react"
import styled from "styled-components"
import { PageHeader, PageInfo } from "../styles/TextStyles"
import LogoSVG from "../../../static/images/LogoSideNav.svg"

export default function ShopTitle(props) {
  return (
    <Wrapper>
      <Logo />
      <Content>
        <Info>{props.info}</Info>
        <Title>{props.title}</Title>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: start;
  @media (max-width: 800px) {
    padding: 24px;
  }
`

// KuH Logo in TopNav
const Logo = styled.div`
  width: 84px;
  height: 79px;
  margin-right: 40px;
  background-image: url(${LogoSVG});
  background-size: cover;
  align-self: center;
  @media (max-width: 800px) {
    margin-right: 24px;
  }
`

const Content = styled.div`
  display: grid;
  justify-items: start;
  margin-top: 8px;
`

const Info = styled(PageInfo)`
  margin-bottom: 4px;
`
const Title = styled(PageHeader)``
