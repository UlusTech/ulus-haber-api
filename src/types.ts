export enum NewsPostState {
    /**
     * Changed after {@linkcode UnderReview}
     */
    Corrected = "corrected",
    /**
     * Reviewing {@linkcode Uncertain}
     */
    UnderReview = "under_review",
    /**
     * Verifyed and proven to be true. Still, it can get {@linkcode UnderReview} and {@linkcode Corrected} and verifyed agein
     */
    Verified = "verified",
    /**
     * Not Reviewed. Maybe no way to correct or verify and cant get it {@linkcode UnderReview}
     */
    Uncertain = "uncertain",
}
