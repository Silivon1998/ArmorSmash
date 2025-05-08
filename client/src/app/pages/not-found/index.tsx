import { NotFoundContent } from "@components/static/not-found";
import { Page } from "@router/Page";
import React from "react";

export default Page(({ params, query }) => {
    return <>
        !!!!!!!!!!!!!!!!!!!!!
       {NotFoundContent}
    </>;
});