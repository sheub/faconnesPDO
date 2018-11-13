import React from "react";
import MyAppBar from "./AppBar";


const MyDrawer = React.lazy(() => import("./MyDrawer"));

class AppbarDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false, // (window.innerWidth > 412), // true if windowSize > 412 (Drawer opened per Default)
        };
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div style={{float: "left"}}>
                <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} />
                {this.state.open ?
                <React.Suspense fallback={<div> Loading Marvelous Drawer...</div>}>
                    <MyDrawer open={this.state.open} handleDrawerClose={this.handleDrawerClose} />
                </React.Suspense>
                : null
            }
            </div>
        );
    }
}

export default AppbarDrawer;