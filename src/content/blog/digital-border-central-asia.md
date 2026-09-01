---
title: "The Digital Border: How Central Asia Is Fighting Gray Smartphone Imports"
description: "IMEI registration systems in Uzbekistan, Kazakhstan, and Kyrgyzstan move border control inside the country — into mobile networks, customs data, and marketplace product cards."
date: 2026-09-01
num: "09"
tags: ["policy", "central asia", "mobile"]
mirrors:
  habr: https://habr.com/ru/articles/1077204/
---

You can buy a smartphone abroad, put it in your suitcase, and physically cross a state border with it. But that is increasingly not enough for the device to work properly in the local mobile network and to be legally present on the domestic market.

After the physical border, a second one appears — a digital one. The state gets the ability to re-check and restrict a device already inside the country: by IMEI, import records, the customs declaration, importer details, and in some procedures even by the identity of the person who registered and/or uses the device.

Part of the control thus moves from airports and road checkpoints into telecommunications and retail infrastructure. IMEI-based control is becoming one of the mechanisms of this digital border.

This article covers the systems of Uzbekistan, Kazakhstan, and Kyrgyzstan. Tajikistan has had its own IMEI identification system since 2023, but it is outside the scope of this text, and for Turkmenistan I could not find comparable open data. The material reflects the state of things as of September 1, 2026. Procedures change, so before a specific purchase or trip it is worth re-checking the official instructions.

## What is IMEI, and why can one phone have several of them

IMEI — International Mobile Equipment Identity — is a 15-digit identifier of mobile equipment. Unlike a SIM card, which belongs to a subscriber's plan, the IMEI identifies the device itself as it operates in a cellular network.

The formula "one phone — one IMEI" does not always hold. A multi-SIM device can have several network connections and several IMEIs tied to individual SIMs or eSIMs. Current GSMA requirements list combinations of physical SIMs and eSIMs, and separately cover devices with multiple IMEIs. That is why a modern dual-SIM smartphone usually shows IMEI1 and IMEI2.

*Infographic of the UzIMEI registry (Uzbekistan): the number of registered IMEIs cannot be directly read as the number of physical phones. Two identifiers of one device can enter the registry as two records.*

## Why most users and subscribers have never registered anything

First, when these systems launched or were updated, devices already in use were usually added to whitelists automatically. In Kazakhstan, the new 2025 rules applied to devices imported after the reform, while phones already in the database kept working without a repeat procedure. There, the regulator also reported about 3.7 million devices with duplicate IMEIs — a clear illustration of why a record in an old registry does not prove the uniqueness of a code or the origin of a device.

In Kyrgyzstan, phones that were already working with local operators' SIM cards before the full launch were also registered automatically. After June 25, 2024, mandatory registration became primarily a question for new devices and new import channels.

Second, with a legal purchase inside the country, the paperwork usually stays with the manufacturer, importer, or seller. A buyer notices the digital border mainly when the usual route of the goods changes: the phone is brought from a trip, ordered on a foreign marketplace, received through an acquaintance, or bought from a local seller who never registered the device.

Third, a separate exception exists for international roaming. A roamer in this context is not simply a foreigner with a phone, but a subscriber of a foreign operator who keeps a foreign SIM in the device and gets connectivity through the local network under a roaming agreement. This is the standard scenario for tourists.

A foreigner who buys a local operator's SIM stops being a roamer in the technical sense and must follow the usual IMEI registration rules of the country.

## One smartphone — three scenarios

For a digital system, what matters is not only where the phone came from but how exactly it reached the user. A local purchase, personal baggage, and an international parcel create different documentary trails. An unregistered device at a local seller and a phone brought by a friend are branches of these routes, not standalone scenarios.

The scheme leaves out country-specific details and describes the general approach that is taking hold across the EAEU space.

There is usually also a grace period of 30 days, but it does not replace declaration at the border. It is a common window for subsequent registration or verification; the starting point and the required documents depend on the country.

Among other things, personal import is limited. In Uzbekistan, you can bring in up to two devices per entry by air within the general duty-free allowance of $1,000 worth of goods, and one device every six months through land checkpoints. In Kyrgyzstan the limit is two devices per year. In Kazakhstan, two devices per year is the limit of individual verification, not the general duty-free allowance. A dual-SIM phone still counts as one physical device.

What is more, when ordering on a marketplace, what matters is not the platform itself or the country where the marketplace is registered, but where the seller is located and where the goods ship from. A device from a local warehouse must be registered by the seller; for an international parcel, the consumer needs a tracking number, an invoice, and the available customs documents, and will probably have to go through customs clearance independently. That sounds burdensome for routine purchases, so most consumers will likely keep choosing verified local sellers with devices already registered.

In Uzbekistan, a phone not declared at entry can be registered post factum through a separate government service, but it is not a free replacement for a declaration: for such a device, a customs payment of 30% of the full customs value applies. For Kazakhstan and Kyrgyzstan, no such legalization mechanism exists.

## Why a second border was needed

A smartphone is convenient for gray imports: it is expensive, compact, easy to carry in small batches, and a commercial flow can be split among individuals. Physical customs sees baggage or cargo at the moment of crossing. The mobile network gets another chance to see the specific device already inside the country.

Hence the common architecture: physical border → customs trail → IMEI → digital check → mobile network and domestic market.

IMEI control does not replace customs. It gives the state a second chance to match a device against origin data after the device has physically arrived inside the country.

## From accounting to origin and point-of-sale control

The first generation of control mainly answered the question: "Does this IMEI exist in the database or not?" But a registry record does not guarantee that the code is unique, not cloned, and tied to a legal import.

In Uzbekistan, after the system launched, a problem emerged of registrations under other people's passport data. In response, Face ID and phone number verification were added to the process, to tie the action to a specific person and reduce the risk of someone else's data being used.

The Kazakh case shows the next step: registration turned into verification. The system checks IMEI authenticity, GSMA lists, and the legality of import; since April 2026 the code appears in the passenger declaration, and since August the control has reached sellers and electronic platforms.

In Kyrgyzstan, the system initially provided for GSMA checks, white, gray, and black lists, and integration with customs, tax authorities, and telecom operators. But it, too, had to be reworked: in October 2024, commercial import registration was moved from the stage before filing the declaration to the stage after the goods are released, and in 2025 the Cabinet of Ministers approved a modernization, a change of system operator, and a simplified procedure.

Put together into one analytical frame, these cases trace an evolution: accounting → identification → origin verification → point-of-sale control.

## The digital border has reached marketplaces

For a marketplace, a smartphone stops being an ordinary product category. The platform has to account for the government status of a device, fix the seller's obligations, and give the buyer a way to check the IMEI. On a real Uzum screenshot provided for this article, the adaptation is visible right in the product card: the seller placed a UzIMEI registration mark and separately disclosed the two IMEIs of a dual-SIM device. In Kazakhstan, since August 2026, the duty to check restrictions before sale extends directly to electronic commerce as well.

The Kazakh transition also showed up in Kaspi.kz reporting. In the Q3 2025 results, on the category GMV slide, smartphones fell 38% year over year, while e-commerce GMV excluding smartphones grew 25% year over year. Kaspi also mentioned insufficient supply of new models, including the iPhone 17, and expected demand normalization in 2026.

## Has gray import really decreased?

Here the three countries cannot be reduced to one comparison chart: the available indicators differ in period, definition, and source.

### Uzbekistan

UzIMEI has been operating since 2019. According to data provided in August 2026 by a representative of the system operator, over seven years more than 97.8 million IMEIs have been registered, registration payments have exceeded 3 trillion soums, and the share of legally imported phones is estimated at 93%. Of these, 47.6 million codes were registered automatically and free of charge in the first year.

But these numbers cannot be read as an independent estimate of a causal effect. 97.8 million is a count of identifiers, not physical smartphones; 93% is the center's own assessment, not a uniform, comparable indicator calculated the same way for every country. On top of that, official imports are simultaneously driven by customs rules, consumer demand, exchange rates, supply channels, and IMEI control itself.

### Kazakhstan

The new verification has been in force since March 2025, and the link to the passenger declaration and the retail sale ban appeared only in 2026. So there is no full long "before and after" series yet. The observed fact — a strong disruption in smartphone supply reflected by Kaspi.kz — speaks to the scale of the supply chain restructuring, but does not yield a ready estimate of the market share that became legal.

### Kyrgyzstan

The mandatory system has been operating since June 2024 and has been revised several times since launch. There is no public data in the reviewed sources that would reliably say "the gray market was X% and became Y%." The changes in customs procedure and the subsequent modernization rather show that building digital control was a process, not a one-time switch.

## The digital border is a compromise

IMEI control has a clear economic and technical logic. If a commercial device bypassed official customs clearance, the mobile network creates one more checkpoint. If an IMEI is fake, cloned, or on an international blocked-device list, the digital layer offers capabilities that a simple inspection of the box in a shop does not.

But the same mechanism creates extra friction for the law-abiding consumer. A person can buy a phone on a trip, order it from a foreign online store, ask a friend to bring it as a gift, or find a good price at a small local shop. For the buyer, these are five ways to get the same smartphone. For the system, these are five different chains of origin, documents, and responsibility.

So the main question for the development of such systems is not ranking countries as "better" or "worse." It sounds different: how precisely can the digital border distinguish gray commercial imports from an ordinary person with one new phone — and how quickly does it fix the mistake when a legal device ends up on the wrong list?

As IMEI control matures, the customs border less and less ends at the airport or the road checkpoint. Its individual functions continue inside the country — in mobile network data, the GSMA database, the customs declaration, the identification procedure, the marketplace product card, and the status of a specific IMEI.

*The material is based on open data and publications; if you spot an inaccuracy or an error, please report it in the comments.*
