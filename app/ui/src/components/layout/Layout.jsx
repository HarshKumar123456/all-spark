import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";

// For Toast Notification & Sorry if You were Expecting some other package here for this use case :)
import { Toaster } from 'sonner';

const Layout = (props) => {
    return <>
        <Header />
        <Toaster />
        {props.children}
        <Footer />
    </>;
};


export default Layout;