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

  // Helfer
  const [helfer, setHelfer] = useState("")
  const helferArray = [
    { name: "Essensverkauf", value: helferEssen },
    { name: "Bar", value: helferBar },
    { name: "Einlass", value: helferEinlass },
    { name: "Parkplatzeinweisung", value: helferParken },
    { name: "Security", value: helferSecuri },
    { name: "Sani", value: helferSani },
    { name: "Awareness", value: helferAwareness },
    { name: "Sanitäre Anlagen", value: helferKlo },
    { name: "Technik", value: helferTech },
    { name: "Aufräumdienst", value: helferClean },
  ]
  const [whileCategories, setWhileCategories] = useState([])
  const [isWo, setIsWo] = useState(false)
  const [isHelferSection, setIsHelferSection] = useState(false)
  const [isDauer, setIsDauer] = useState()
  const [isHelperDetails, setIsHelperDetails] = useState()

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

  // Scan Präferenzen für Währenddessen Helfer Array for true
  useEffect(() => {
    helferArray
      .filter(item => item.value === true)
      .map(filteredHelfer =>
        // console.log("True Helfers: " + filteredHelfer.name)
        {
          setWhileCategories(whileCategories => [
            ...whileCategories,
            filteredHelfer.name,
          ])
        }
      )
  }, [])

  // Helfer Länge
  useEffect(() => {
    if (helferLarge) {
      return setIsDauer("L (3x 6 h)")
      console.log("Dauer: " + isDauer)
    }
    if (helferMedium) {
      return setIsDauer("M (2x 6 h)")
      console.log("Dauer: " + isDauer)
    }
    if (helferSmall) {
      return setIsDauer("S (1x 6 h)")
      console.log("Dauer: " + isDauer)
    } else {
      return setIsDauer("Egal")
    }
  }, [])

  useEffect(() => {
    // Scan Helfer Array for true
    if (helferBefore || helferWhile || helferAfter) {
      return setIsHelferSection(true)
    } else {
      setIsHelferSection(false)
    }
  }, [])

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
          ticket: "Festival Ticket 102 €*",
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
    } else if (sumTickets === 112) {
      setProducts(products => [
        ...products,
        {
          ticket: "Festival Ticket 102 €*",
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
        <ShopTitle info="Schritt 4/4" title="Übersicht & Bezahlen" />
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
                    {street} {houseNumber}, {postcode}, {city}
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
                      ? "Probemitgliedschaft ab 1. Juli 2022 für 90 Tage, endet automatisch"
                      : "Nein"}
                  </Info>
                </Group>
                <Group>
                  <Value>Newsletter</Value>
                  <Info>{newsletter ? "Ja" : "Nein"}</Info>
                </Group>
              </Section>
              <Helfer>
                <Section>
                  <Group>
                    <Value>Helfer</Value>
                    <Info>{helfer}</Info>
                  </Group>
                  <HelferDetail isHelperDetails={isHelferSection}>
                    <Group>
                      <Value>Dauer</Value>
                      <Info>{isDauer}</Info>
                    </Group>
                    <Wo isWo={helferWhile}>
                      <Group>
                        <Value>Präferenz während</Value>
                        <Info>
                          {whileCategories.length >= 1
                            ? whileCategories.join(", ")
                            : "-"}
                        </Info>
                      </Group>
                    </Wo>
                    <Group>
                      <Value>Helferbuddy</Value>
                      <Info>{helferBuddy == "" ? "-" : helferBuddy}</Info>
                    </Group>
                    <Group>
                      <Value>Ehrenamtlich</Value>
                      <Info>{helferEhrenamtlich ? "Ja" : "Nein"}</Info>
                    </Group>
                  </HelferDetail>
                </Section>
              </Helfer>
              <Section>
                <Group>
                  <Value>Erstattung</Value>
                  <Info>
                    Sollte das Festival nicht stattfinden können, wirst du
                    zwischen einem Übertrag deines Tickets auf das Jahr 3 und
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
              <Section>
                <Seperator />
                <Group>
                  <Value>Bezahlen</Value>
                  <PayPalGroup>
                    <PayPalButton
                      // currency={currency}
                      showSpinner={false}
                      amount={sumTickets}
                      onSuccess={paypalSuccess}
                    />
                  </PayPalGroup>
                </Group>
              </Section>
              {/* <PayPalButtons style={{ layout: "horizontal" }} /> */}
            </form>
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
  max-width: 1000px;
  /* padding: 10px 20px 200px 20px; */
  padding: 60px 40px;
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`

const Section = styled.div`
  margin-bottom: 40px;
`

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  padding-right: 120px;
  @media (max-width: 1100px) {
    padding-right: 60px;
  }
  @media (max-width: 768px) {
    gap: 0px;
    grid-template-columns: 1fr;
    margin-bottom: 15px;
    padding-right: 0px;
  }
`

const HelferDetail = styled.div`
  display: ${props => (props.isHelperDetails ? "grid" : "none")};
`

const Value = styled(SubheaderSmall)`
  /* color: rgba(255, 255, 255, 0.5); */
  margin-top: 10px;
  justify-self: right;
  @media (max-width: 768px) {
    justify-self: left;
  }
`

const InfoGroup = styled.div``

const Info = styled(Note)`
  /* color: white; */
  margin-top: 13px;
  @media (max-width: 768px) {
    margin-top: 4px;
  }
`

const InfoSmall = styled(Note)`
  margin-top: 10px;
  /* color: white; */
  opacity: 0.5;
  font-size: 0.8rem;
`

const ButtonGroup = styled.div`
  display: grid;
  justify-content: center;
  /* margin-top: 80px; */
  padding: 40px 40px;

  @media (max-width: 768px) {
    padding: 20px 20px;
  }
`

const PayPalGroup = styled.div`
  margin-top: 15px;
`

// Helfer
const Helfer = styled.div`
  /* display: ${props => (props.helferSection ? "grid" : "none")}; */
`

const Wo = styled.div`
  display: ${props => (props.isWo ? "grid" : "none")};
`

const Seperator = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 60px 0;
  width: 100%;
  @media (max-width: 768px) {
    margin: 30px 0;
  }
`
