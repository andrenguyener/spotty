import Chart from "chart.js";
import React from "react";

import styled from "styled-components";
import { theme } from "../styles";
const { fonts } = theme;

const properties = [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "liveness",
    "speechiness",
    "valence",
];

const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 700px;

    #chart {
        margin: 0 auto;
        margin-top: -30px;
    }
`;

type Features =
    | SpotifyApi.AudioFeaturesResponse
    | SpotifyApi.MultipleAudioFeaturesResponse
    | SpotifyApi.AudioFeaturesObject[];

const FeatureChart: React.FC<{
    features: Features;
    type: string;
}> = (props) => {
    React.useEffect(() => {
        parseData();
    }, []);

    React.useEffect(() => {
        parseData();
    });

    const parseData = () => {
        const { features } = props;
        const dataset = createDataset(features);
        createChart(dataset);
    };

    const isMultipleFeatures = (
        features: Features
    ): features is SpotifyApi.MultipleAudioFeaturesResponse | SpotifyApi.AudioFeaturesObject[] => {
        return Array.isArray(features);
    };

    const avg = (arr: any) => arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

    const createDataset = (features: Features): { [K in keyof typeof properties]: number } => {
        const dataset = {};

        properties.forEach((prop) => {
            (dataset as any)[prop] = isMultipleFeatures(features)
                ? avg((features as any).map((feat: any) => feat && feat[prop]))
                : (features as any)[prop];
        });

        return dataset as { [K in keyof typeof properties]: number };
    };

    const createChart = (dataset: { [K in keyof typeof properties]: number }) => {
        const { type } = props;
        const ctx = document.getElementById("chart") as HTMLCanvasElement;
        const labels = Object.keys(dataset);
        const data = Object.values(dataset) as number[];
        if (ctx) {
            // tslint:disable-next-line:no-unused-expression
            new Chart(ctx, {
                type: type || "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "",
                            data,
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.3)",
                                "rgba(255, 159, 64, 0.3)",
                                "rgba(255, 206, 86, 0.3)",
                                "rgba(75, 192, 192, 0.3)",
                                "rgba(54, 162, 235, 0.3)",
                                "rgba(104, 132, 245, 0.3)",
                                "rgba(153, 102, 255, 0.3)",
                            ],
                            borderColor: [
                                "rgba(255,99,132,1)",
                                "rgba(255, 159, 64, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(104, 132, 245, 1)",
                                "rgba(153, 102, 255, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        },
                    },
                    title: {
                        display: true,
                        text: `Audio Features`,
                        fontSize: 18,
                        fontFamily: `${fonts.primary}`,
                        fontColor: "#ffffff",
                        padding: 30,
                    },
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    color: "rgba(255, 255, 255, 0.3)",
                                },
                                ticks: {
                                    fontFamily: `${fonts.primary}`,
                                    fontSize: 12,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    color: "rgba(255, 255, 255, 0.3)",
                                },
                                ticks: {
                                    beginAtZero: true,
                                    fontFamily: `${fonts.primary}`,
                                    fontSize: 12,
                                },
                            },
                        ],
                    },
                },
            });
        }
    };

    return (
        <Container>
            <canvas id="chart" width="400" height="400" />
        </Container>
    );
};

export default FeatureChart;
