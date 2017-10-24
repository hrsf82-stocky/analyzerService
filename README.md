# Project Name

macD–Analyzer Service

## Roadmap

tbd
<!-- View the project roadmap [here](LINK_TO_DOC) -->

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

> Some usage instructions

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Other Information

Our (from the bank's perspective) forex traders need any edge they can get. Serving up data on what the most successful traders on our platform are doing gives them a twofold edge. 1) They can take the data and incorporate the same metrics into their own strategy - ex: we see most of the successful traders look at the MACD frequently, therefore you should incorporate the MACD into your trading strategy. 2) They can take the data and form a counter-strategy - ex: we see most of the successful traders are looking at the MACD, meaning they're likely to respond in a certain way when the MACD changes. Look out for that trigger, and have a plan to capitalize on it.

Specific actions might include: setting support levels for a certain currency at a specific level, making trades counter to the market knowing that most users are likely to respond in a certain way, or changing workflow to incorporate data points which we see are significant.

The Analyzer service uses the data collected in 3 and 4 to generate a list of top 10 most profitable traders for each pair. This data is OUTPUT to the rest of the system as it is updated. Additionally, the Analyzer service OUTPUTs the profit and activity data for a particular user, upon external request.

View the architecture diagram [here](https://www.lucidchart.com/invitations/accept/f1893bda-1f01-428d-9e3a-f6528430a7fc)

(TODO: schema, and other app details)

