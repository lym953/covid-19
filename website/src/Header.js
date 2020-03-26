import React from 'react';
import * as USCounty from "./USCountyInfo.js";
import Select from 'react-select';
import Disqus from "disqus-react"
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

function browseTo(history, state, county) {
    history.push(
        "/county/" + encodeURIComponent(state) + "/" + encodeURIComponent(county),
        history.search,
    );
}

const useStyles = makeStyles(theme => ({
    qpContainer: {
        display: 'none',
        // color: '#FFFFFF',
        background: '#e3e3e3',
        borderWidth: "1px",
        padding: 15,
        margin: 15,
        // borderRadius: 20,
    },
}));


const search = USCounty.getCountySummary1();
const SearchBox = (props) => {
    let summary = search.sort((a, b) => {
        let x = a.total;
        let y = b.total;
        if (!x) x = 0;
        if (!y) y = 0;

        return y - x;
    });
    let counties = summary
        .map(c => {
            return {
                label: `${c.county} , ${c.state_name} (${c.total})`,
                value: c,
            };
        });
    return <Select
        className="basic-single"
        classNamePrefix="select"
        styles={{
            menu: provided => ({ ...provided, zIndex: 9999 })
        }}
        defaultValue={""}
        placeholder={"Search for a County"}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="county_selection"
        options={counties}
        onChange={param => {
            if (props.callback) {
                if (param.value) {
                    props.callback(param.value.county, param.value.state_name);
                }
            }

        }}
    />;
}

const withHeader = (comp, props) => {

    const disqusShortname = "covid19direct";
    const disqusConfig = {
        url: "https://covid-19.direct",
        identifier: "article-id",
        title: "main page"
    };

    return (props) => {
        const classes = useStyles();
        let component = comp({
            // add addition things here
            ...props,
        });
        let footer = <div>
            <Typography variant="h5" noWrap>
                Discussions
                    </Typography>
            <Disqus.DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>;

        let header = <header className="App-header">
            <Typography variant="h5" >
                COVID-19.direct
            </Typography>
            <SearchBox
                callback={(newcounty, newstate) => {
                    browseTo(props.history, newstate, newcounty);
                }}
            />

            <div className={classes.qpContainer}>
                <Typography variant="body1" >
                    Data Source changed. Please report errors in discussion section.
            </Typography>

            </div>

            {component}
            {footer}
        </header>

        return header;
    }
};


export { withHeader }
