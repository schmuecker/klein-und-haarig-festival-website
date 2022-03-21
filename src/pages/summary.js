import React, { useEffect, useState } from "react"
import styled from "styled-components"
import FormButton from "../components/buttons/FormButton"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import ShopTitle from "../components/shopping/ShopTitle"
import { navigate } from "gatsby"
import addToMailchimp from "gatsby-plugin-mailchimp"
import Airtable from "airtable"
import useAudienceCount from "../helper/useAudienceCount"
import uniqid from "uniqid"
import SubmitButton from "/static/images/Submit-Button.jpg"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import PayPalButton from "../components/PayPalButton"
// test

import {
  Headline,
  SubheaderSmall,
  Note,
  TextSmall,
} from "../components/styles/TextStyles"

const base = new Airtable({
  apiKey: process.env.GATSBY_AIRTABLE_API_KEY,
}).base(process.env.GATSBY_AIRTABLE_BASE)

const table = base("Teilnehmer 2022")

export default function Summary({ location }) {
  const { state = {} } = location
  const {
    sumTickets,
    firstName,
    lastName,
    email,
    phone,
    street,
    houseNumber,
    postcode,
    city,
    datenspeicherung,
    vereinsbeitritt,
    newsletter,
    helferBefore,
    helferWhile,
    helferAfter,
    helferSmall,
    helferMedium,
    helferLarge,
    helferEssen,
    helferBar,
    helferEinlass,
    helferParken,
    helferSecuri,
    helferSani,
    helferAwareness,
    helferKlo,
    helferTech,
    helferClean,
    helferBuddy,
    helferEhrenamtlich,
    onlyFriends,
  } = state

  // const [ticketType, setTicketType] = useState("")
  const [products, setProducts] = useState([])
  const festivalTicket = "Ja"
  const [autoTicket, setAutoTicket] = useState("Nein")
  const [camperTicket, setCamperTicket] = useState("Nein")
  const [helfer, setHelfer] = useState("")

  // Audience Count
  const audienceCount = useAudienceCount()
  console.log("hook count: " + audienceCount)
  const audienceLimit = 200

  // Unique ID
  const userID = uniqid()
  console.log("User ID" + userID)

  // POST TO — AIRTABLE
  const paypalSuccess = data => {
    console.log(data)
    console.log(
      "audienceCount:  " + audienceCount,
      "audienceLimit:  " + audienceLimit
    )
    addToMailchimp(email, {
      ID: userID,
      FNAME: firstName,
      LNAME: lastName,
      PHONE: phone,
      STREET: street,
      HOUSENUMB: houseNumber,
      POSTCODE: postcode,
      CITY: city,
      DATASAVE: datenspeicherung,
      VEREIN: vereinsbeitritt,
      NEWSLETTER: newsletter,
      TFESTIVAL: festivalTicket,
      TAUTO: autoTicket,
      TCAMPER: camperTicket,
      BEFORE: helferBefore,
      WHILE: helferWhile,
      AFTER: helferAfter,
      SMALL: helferSmall,
      MEDIUM: helferMedium,
      LARGE: helferLarge,
      ESSEN: helferEssen,
      BAR: helferBar,
      EINLASS: helferEinlass,
      PARK: helferParken,
      SECURI: helferSecuri,
      SANI: helferSani,
      AWARE: helferAwareness,
      KLO: helferKlo,
      TECH: helferTech,
      CLEAN: helferClean,
      BUDDY: helferBuddy,
      EHRE: helferEhrenamtlich,
      FRIENDS: onlyFriends,
    })
      .then(({ msg, result }) => {
        console.log("msg", `${result}: ${msg}`)

        if (result !== "success") {
          throw msg
        }
        // alert(msg)
        table
          .create([
            {
              fields: {
                ID: userID,
                Festival: festivalTicket,
                Auto: autoTicket,
                Camper: camperTicket,
                Aufbau: helferBefore,
                Waehrend: helferWhile,
                Abbau: helferAfter,
                OrderID: data.orderID,
                Email: email,
              },
            },
          ])
          .then(() => {
            navigate("/submitted")
          })
      })
      .catch(err => {
        console.log(err)
        alert(
          "Du hast du Probleme ein Ticket zu buchen? Bitte versuche es noch einmal in einem privaten Tab oder in einem anderen Browser, ohne dabei über die Browsernavigation vor oder zurück zu springen. Pro E-Mail-Adresse kann nur ein Ticket erworben werden."
        )
      })

    if (newsletter) {
      addToMailchimp(
        email,
        {
          FNAME: firstName,
          LNAME: lastName,
        },
        process.env.GATSBY_MAILCHIMP_API_NEWSLETTER
      )
    }
  }

  useEffect(() => {
    setProducts([])
    // Helfer
    if (helferBefore && !helferWhile && !helferAfter) {
      setHelfer("Aufbau")
    } else if (helferBefore && helferWhile && !helferAfter) {
      setHelfer("Aufbau & Während des Festivals")
    } else if (helferBefore && helferWhile && helferAfter) {
      setHelfer("Aufbau, Während des Festivals & Abbau")
    } else if (!helferBefore && helferWhile && !helferAfter) {
      setHelfer("Während des Festivals")
    } else if (!helferBefore && helferWhile && helferAfter) {
      setHelfer("Während des Festivals & Abbau")
    } else if (!helferBefore && !helferWhile && helferAfter) {
      setHelfer("Abbau")
    } else if (helferBefore && !helferWhile && helferAfter) {
      setHelfer("Aufbau & Abbau")
    } else {
      setHelfer("Nein")
    }

    // Ticketsumme
    if (sumTickets === 102) {
      setProducts(products => [
        ...products,
        {
          ticket: "Festival Ticket 100 €*",
        },
      ])
    } else if (sumTickets === 80) {
      setProducts(products => [
        ...products,
        {
          ticket: "Festival Ticket 75 €*",
        },
        {
          ticket: "Auto Parkplatz 5 €",
        },
      ])
      setAutoTicket("Ja")
    } else if (sumTickets === 85) {
      setProducts(products => [
        ...products,
        {
          ticket: "Festival Ticket 100 €*",
        },
        {
          ticket: "Camper Stellplatz 10 €",
        },
      ])
      setCamperTicket("Ja")
    } else if (sumTickets === 90) {
      setProducts(products => [
        ...products,
        {
          ticket: "Festival Ticket 75 €*",
        },
        {
          ticket: "Auto Parkplatz 5 €",
        },
        {
          ticket: "Camper Stellplatz 10 €",
        },
      ])
      setAutoTicket("Ja")
      setCamperTicket("Ja")
    }
  }, [sumTickets])

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "test",
        components: "buttons",
        currency: "EUR",
      }}
    >
      <Layout>
        <SEO title="Summary" />
        <ShopTitle info="Schritt 4/4" title="Schick ab das Ding" />
        <Container>
          <Wrapper>
            <form>
              {/*onSubmit={submit}*/}
              <Section>
                <Group>
                  <Value>Dein(e) Ticket(s)</Value>
                  <InfoGroup>
                    {products.map(product => (
                      <Info>{product.ticket}</Info>
                    ))}
                    <InfoSmall>
                      *10 € Probemitgliedschaft, 90 € Unkosten, 2 € Paypal
                      Servicegebühren
                    </InfoSmall>
                  </InfoGroup>
                </Group>
              </Section>
              <Section>
                <Group>
                  <Value>Du</Value>
                  <Info>
                    {firstName} {lastName}
                  </Info>
                </Group>
                <Group>
                  <Value>E-Mail</Value>
                  <Info>{email}</Info>
                </Group>
                <Group>
                  <Value>Telefonnummer</Value>
                  <Info>{phone || "-"}</Info>
                </Group>
                <Group>
                  <Value>Adresse</Value>
                  <Info>
                    {street}, {houseNumber}, {postcode}, {city}
                  </Info>
                </Group>
                <Group>
                  <Value>Datenspeicherung</Value>
                  <Info>{datenspeicherung ? "Passt" : "Nein"}</Info>
                </Group>
                <Group>
                  <Value>Vereinsbeitritt</Value>
                  <Info>
                    {vereinsbeitritt
                      ? "Probemitgliedschaft ab 1. Juli 2021 für 90 Tage, endet automatisch"
                      : "Nein"}
                  </Info>
                </Group>
                <Group>
                  <Value>Newsletter</Value>
                  <Info>{newsletter ? "Ja" : "Nein"}</Info>
                </Group>
              </Section>
              <Section>
                <Group>
                  <Value>Helfer</Value>
                  <Info>{helfer}</Info>
                </Group>
              </Section>
              <Section>
                <Group>
                  <Value>Erstattung</Value>
                  <Info>
                    Sollte das Festival nicht stattfinden können, wirst du
                    zwischen einem Übertrag deines Tickets auf das Jahr 2022 und
                    einer Teilrückzahlung wählen können. Wir geben unser Bestes,
                    Ausgaben bis kurz vor dem Festival gering zu halten, um dir
                    einen möglichst großen Betrag zu erstatten.
                  </Info>
                </Group>
              </Section>
              <Section>
                <Group>
                  <Value>Corona</Value>
                  <Info>
                    Sehr wahrscheinlich wird ein 2G Nachweis benötigt (keine
                    Ungeimpften mit Test). Je nach Corona-Situation im Juli
                    können sich die Bestimmungen noch ändern. Dies werden wir
                    rechtzeitig vor dem Festival kommunizieren.
                  </Info>
                </Group>
              </Section>
              {/* <PayPalButtons style={{ layout: "horizontal" }} /> */}
              <ButtonGroup>
                <ButtonWrapper>
                  {/* <FormButton
                  typ="submit"
                  label="Daten abschicken und Ticket(s) reservieren"
                  background={SubmitButton}
                  color="white"
                ></FormButton> */}
                </ButtonWrapper>
              </ButtonGroup>
              ;
            </form>
            <PayPalButton
              // currency={currency}
              showSpinner={false}
              amount={sumTickets}
              onSuccess={paypalSuccess}
            />
          </Wrapper>
        </Container>
      </Layout>
    </PayPalScriptProvider>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
`

const Wrapper = styled.div`
  max-width: 800px;
  padding: 10px 20px 200px 20px;
`

const Section = styled.div`
  margin-bottom: 40px;
`

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`

const Value = styled(SubheaderSmall)`
  /* color: rgba(255, 255, 255, 0.5); */
  margin-top: 10px;
  justify-self: right;
`

const InfoGroup = styled(Note)``

const Info = styled(Note)`
  /* color: white; */
  margin-top: 13px;
`

const InfoSmall = styled(TextSmall)`
  margin-top: 10px;
  /* color: white; */
  opacity: 0.5;
  /* font-size: 0.8rem; */
`

const ButtonGroup = styled.div`
  display: grid;
  justify-content: center;
  /* margin-top: 80px; */

  padding: 40px 40px;
`

const ButtonWrapper = styled.div`
  max-width: 500px;
`

// Um deine Reservierung abzuschließen, prüfe deine Daten und schicke Sie über den Button unten ab.
