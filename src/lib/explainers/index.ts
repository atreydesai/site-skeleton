// Live explainers for research papers, keyed by paper id. PaperMedia renders
// the paper's explainer as its card media and lightbox; a paper without an
// entry falls back to its static figure when one is available.
//
// The components here were drawn for the original site's papers; treat them
// as templates. The three example papers borrow one each so the cards show a
// live figure. The `template-*` keys match no paper, so they only appear on
// /dev/explainers/ (dev only), where every entry here is previewed.
import type { Component } from "svelte";
import ArtifactsExplainer from "./ArtifactsExplainer.svelte";
import BenchMarkerExplainer from "./BenchMarkerExplainer.svelte";
import BookTubeExplainer from "./BookTubeExplainer.svelte";
import CalExplainer from "./CalExplainer.svelte";
import DistractorsExplainer from "./DistractorsExplainer.svelte";
import FillerGapExplainer from "./FillerGapExplainer.svelte";
import HumorExplainer from "./HumorExplainer.svelte";
import OccludedExplainer from "./OccludedExplainer.svelte";
import ReasonersExplainer from "./ReasonersExplainer.svelte";
import RlTapExplainer from "./RlTapExplainer.svelte";
import type { ExplainerProps } from "./motion";

export type { ExplainerProps };
export type ExplainerComponent = Component<ExplainerProps>;

export const explainers: Partial<Record<string, ExplainerComponent>> = {
	"example-paper-one": ReasonersExplainer,
	"example-paper-two": BenchMarkerExplainer,
	"example-paper-three": DistractorsExplainer,
	"template-filler-gap": FillerGapExplainer,
	"template-calibration": CalExplainer,
	"template-artifacts": ArtifactsExplainer,
	"template-rl-tap": RlTapExplainer,
	"template-booktube": BookTubeExplainer,
	"template-humor": HumorExplainer,
	"template-occluded": OccludedExplainer,
};
