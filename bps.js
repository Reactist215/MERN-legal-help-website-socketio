
function Sites({
    studyId,
    editTextItem,
    setEditTextItem,
    editSelectItem,
    setEditSelectItem,
    showCalenderDialog,
    confirmSelectedItem,
    setConfirmSelectedItem,
    setShowCalenderDialog,
    mapDialogItem,
    setMapDialogItem,
    setMapDefaultItem,
    addSiteDialog,
    setAddSiteDialog,
    addSiteMutation,
    setAlert,
    locales,
    timezones,
    sites,
    proxyNumbers,
    handleSelect,
    handleConfirm,
    handleEditText,
    handleMap,
    rowMenu,
    setRowMenu,
    handleMenuOpen,
    handleMenuClose,
}) {
    const classes = useStyles();
    const [siteDurationQuery, query] = getSiteDurationLazy();

    const toggleCalenderClose = () => {
        setShowCalenderDialog({ ...showCalenderDialog, show: false });
        query.refetch();
    };

    function AddButton() {
        return (
            <Button
                color="primary"
                variant="outlined"
                onClick={() =>
                    locales.length
                        ? setAddSiteDialog(true)
                        : setAlert('Please add study locale(s) first.')
                }
            >
                <Add />
        Add site
            </Button>
        );
    }

    return (
        <>
            <Paper className={classes.root}>
                <AddButton />
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Site Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Proxy number</TableCell>
                            <TableCell>Locales</TableCell>
                            <TableCell>Last update</TableCell>
                            <TableCell>Users</TableCell>
                            <TableCell>Candidates</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Default</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {map(sites, site => {
                            const { status } = site;
                            const editable = ['DRAFT', 'INACTIVE'].includes(status);
                            const cellClassName = editable ? classes.editableRow : null;

                            const handleEdit = item => () =>
                                editable &&
                                setEditTextItem({
                                    id: site.id,
                                    item,
                                    value: site[item],
                                });

                            const handleEditMap = () =>
                                editable &&
                                setMapDialogItem({
                                    id: site.id,
                                    item: 'coordinates',
                                    latitude: site.coordinates.latitude,
                                    longitude: site.coordinates.longitude,
                                    siteId: site.siteId,
                                    name: site.name,
                                    timezone: site.timezone,
                                });

                            const handleEditNumber = item => () =>
                                editable &&
                                setEditSelectItem({
                                    id: site.id,
                                    item,
                                    value: get(site, `${item}.id`),
                                    options: proxyNumbers[item],
                                    proxyNumberPicker: true,
                                });

                            const handleEditLocales = () =>
                                editable &&
                                setEditSelectItem({
                                    id: site.id,
                                    item: 'languages',
                                    value: get(site, 'languages', []).map(({ locale }) => locale),
                                    options: locales.map(({ locale, language: { name } }) => ({
                                        value: locale,
                                        label: name,
                                    })),
                                    multiple: true,
                                });

                            function Flag({ item }) {
                                return get(item, 'country') ? (
                                    <img
                                        className={classes.flag}
                                        src={get(item, 'country.flagIconUrl')}
                                        alt={get(item, 'country.englishName')}
                                    />
                                ) : (
                                        ''
                                    );
                            }

                            function SiteIdTableCell() {
                                const props =
                                    status === 'DRAFT'
                                        ? {
                                            className: cellClassName,
                                            onClick: handleEdit('siteId'),
                                        }
                                        : {};
                                return (
                                    <TableCell {...props}>
                                        <Tooltip title={`Site id ${site.id}`}>
                                            <span>{site.siteId}</span>
                                        </Tooltip>
                                    </TableCell>
                                );
                            }

                            function NameTableCell() {
                                return (
                                    <TableCell
                                        className={cellClassName}
                                        onClick={handleEdit('name')}
                                    >
                                        {site.name}
                                    </TableCell>
                                );
                            }

                            function AddressTooltipTitle() {
                                const { city, state, country, zipCode, timezone } = site;
                                return (
                                    <div>
                                        <div>City: {city}</div>
                                        <div>State: {state}</div>
                                        <div>Country: {country.englishName}</div>
                                        <div>ZIP code: {zipCode}</div>
                                        <div>Timezone: {timezone}</div>
                                    </div>
                                );
                            }

                            function AddressTableCell() {
                                return (
                                    <TableCell className={cellClassName} onClick={handleEditMap}>
                                        <Tooltip title={<AddressTooltipTitle />}>
                                            <span>
                                                <Flag item={site} />
                                                {site.address}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                );
                            }

                            function PhoneTableCell() {
                                return (
                                    <TableCell
                                        className={cellClassName}
                                        onClick={handleEdit('phone')}
                                    >
                                        {site.phone}
                                    </TableCell>
                                );
                            }

                            function ProxyNumberTableContent({ item }) {
                                const value = get(site, item);
                                let Icon;
                                let text;
                                if (item === 'proxyNumber') {
                                    Icon = CallMade;
                                    text = (
                                        <>
                                            Outbound
                                            <br />
                                            Phone number which will be used to call candidates.
                                        </>
                                    );
                                } else {
                                    Icon = CallReceived;
                                    text = (
                                        <>
                                            Inbound
                                            <br />
                                            Phone number candidates will see.
                                        </>
                                    );
                                }
                                return (
                                    <Tooltip title={text}>
                                        <Grid
                                            container
                                            spacing={1}
                                            onClick={handleEditNumber(item)}
                                        >
                                            <Grid item>
                                                {value && (
                                                    <>
                                                        <Flag item={value} />
                                                        {get(value, 'value')}
                                                    </>
                                                )}
                                                {!value && <em>N/A</em>}
                                            </Grid>
                                            <Grid item>
                                                <Icon />
                                            </Grid>
                                        </Grid>
                                    </Tooltip>
                                );
                            }

                            function ProxyNumberTableCell() {
                                return (
                                    <TableCell className={cellClassName}>
                                        <ProxyNumberTableContent item="proxyNumber" />
                                        <ProxyNumberTableContent item="inboundProxyNumber" />
                                    </TableCell>
                                );
                            }

                            function LocalesTableCell() {
                                return (
                                    <TableCell
                                        className={cellClassName}
                                        onClick={handleEditLocales}
                                    >
                                        <Grid container spacing={1}>
                                            {site.languages.map(({ name, locale }) => (
                                                <Tooltip key={locale} title={locale}>
                                                    <Grid item>{name}</Grid>
                                                </Tooltip>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                );
                            }

                            function TimestampsTableCell() {
                                return (
                                    <TableCell>
                                        <Tooltip
                                            title={
                                                <div>
                                                    Created:{' '}
                                                    {format(parseISO(site.createdAt), 'yyyy-LL-dd HH:mm')}
                                                    <br />
                          Updated:{' '}
                                                    {format(parseISO(site.updatedAt), 'yyyy-LL-dd HH:mm')}
                                                </div>
                                            }
                                        >
                                            <span>
                                                {format(
                                                    parseISO(site.updatedAt || site.createdAt),
                                                    'yyyy-LL-dd HH:mm',
                                                )}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                );
                            }

                            function UsersTableCell() {
                                return <TableCell>{site.users.length}</TableCell>;
                            }

                            function CandidatesTableCell() {
                                return (
                                    <TableCell>
                                        {site.candidates.count} (
                                        {site.pendingCandidates.nodes.length} pending)
                                    </TableCell>
                                );
                            }

                            function StatusTableCell() {
                                return (
                                    <TableCell align="center">
                                        <StatusIcon status={status} />
                                    </TableCell>
                                );
                            }

                            const [defaultSite, setDefaultSite] = useState(site.default);

                            const handleDefaultSite = (e) => {
                                setMapDefaultItem({
                                    id: site.id,
                                    item: 'default',
                                    default: e.target.checked
                                });
                            };

                            function DefaultCell() {
                                return (
                                    <TableCell align="center">
                                        <Checkbox
                                            checked={defaultSite}
                                            onChange={handleDefaultSite}
                                        />
                                    </TableCell>
                                );
                            }

                            return (
                                <TableRow key={site.id}>
                                    <SiteIdTableCell />
                                    <NameTableCell />
                                    <AddressTableCell />
                                    <PhoneTableCell />
                                    <ProxyNumberTableCell />
                                    <LocalesTableCell />
                                    <TimestampsTableCell />
                                    <UsersTableCell />
                                    <CandidatesTableCell />
                                    <StatusTableCell />
                                    <DefaultCell />

                                    <TableCell align="right">
                                        <IconButton
                                            size="medium"
                                            onClick={() => {
                                                siteDurationQuery({
                                                    variables: {
                                                        filter: {
                                                            type: 'SITE_SLOT',
                                                            typeIds: Array(String(site.siteId)),
                                                            studyIds: Array(String(studyId)),
                                                        },
                                                    },
                                                });
                                                setShowCalenderDialog({
                                                    show: true,
                                                    siteId: site.siteId,
                                                    siteName: site.name,
                                                    timezone: site.timezone || '',
                                                });
                                            }}
                                        >
                                            <CalendarToday />
                                        </IconButton>
                                        <IconButton
                                            onClick={event => handleMenuOpen({ event, site })}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>

            {rowMenu && (
                <Menu
                    open
                    anchorEl={rowMenu.anchorEl}
                    keepMounted
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        disabled={!['DRAFT', 'INACTIVE'].includes(rowMenu.status)}
                        onClick={() =>
                            setConfirmSelectedItem({
                                action: 'ACTIVATE',
                                variables: { id: rowMenu.id },
                                users: rowMenu.users.length,
                                title: 'Activate site?',
                                message: `Are you sure you want to activate site ${rowMenu.siteId}: ${rowMenu.name} (${rowMenu.address})?`,
                            })
                        }
                    >
                        Activate
          </MenuItem>
                    <MenuItem
                        disabled={rowMenu.status !== 'ACTIVE'}
                        onClick={() =>
                            setConfirmSelectedItem({
                                action: 'DEACTIVATE',
                                variables: { id: rowMenu.id },
                                title: 'Deactivate site?',
                                message: deactivateSiteMessage(rowMenu, classes),
                            })
                        }
                    >
                        Deactivate
          </MenuItem>
                    <MenuItem
                        disabled={rowMenu.status !== 'DRAFT'}
                        onClick={() =>
                            setConfirmSelectedItem({
                                action: 'DELETE',
                                variables: { id: rowMenu.id },
                                title: 'Delete site?',
                                message: `Are you sure you want to delete site ${rowMenu.siteId}: ${rowMenu.name} (${rowMenu.address})?`,
                            })
                        }
                    >
                        Delete
          </MenuItem>
                    <Divider />
                    <MenuItem
                        disabled={!['DRAFT', 'INACTIVE'].includes(rowMenu.status)}
                        onClick={() =>
                            setEditSelectItem({
                                id: rowMenu.id,
                                item: 'timezone',
                                value: rowMenu.timezone,
                                options: timezones,
                            })
                        }
                    >
                        Change timezone
          </MenuItem>
                </Menu>
            )}

            {Object.keys(editTextItem).length > 0 && (
                <EditTextDialog
                    open
                    closeDialog={() => setEditTextItem({})}
                    editItem={editTextItem}
                    handleEdit={handleEditText}
                />
            )}

            {Object.keys(editSelectItem).length > 0 && (
                <EditSelectDialog
                    open
                    closeDialog={() => {
                        setRowMenu(null);
                        setEditSelectItem({});
                    }}
                    editItem={editSelectItem}
                    handleEdit={handleSelect}
                />
            )}

            {Object.keys(confirmSelectedItem).length > 0 && (
                <ConfirmDialog
                    open
                    title={confirmSelectedItem.title}
                    content={confirmSelectedItem.message}
                    close={() => handleConfirm(false)}
                    confirm={() => handleConfirm(true)}
                />
            )}

            {Object.keys(mapDialogItem).length > 0 && (
                <MapDialog
                    open
                    timezones={timezones}
                    editItem={mapDialogItem}
                    closeDialog={() => setMapDialogItem({})}
                    setAlert={setAlert}
                    handleClick={handleMap}
                />
            )}

            {addSiteDialog && (
                <AddSiteDialog
                    open
                    setAlert={setAlert}
                    closeDialog={() => setAddSiteDialog(false)}
                    addSiteMutation={addSiteMutation}
                    studyId={studyId}
                    locales={locales}
                    timezones={timezones}
                    proxyNumbers={proxyNumbers.proxyNumber}
                    inboundProxyNumbers={proxyNumbers.inboundProxyNumber}
                />
            )}
            {showCalenderDialog.show && !query.loading && (
                <AddSiteCalenderDialog
                    open
                    timeSlotDuration={query.data}
                    closeDialog={toggleCalenderClose}
                    studyId={studyId}
                    siteId={showCalenderDialog.siteId}
                    siteName={showCalenderDialog.siteName}
                    timezone={showCalenderDialog.timezone}
                />
            )}
        </>
    );
}

export default compose(
    withState('mapDialogItem', 'setMapDialogItem', {}),
    withState('mapDefaultItem', 'setMapDefaultItem', {}),
    withState('addSiteDialog', 'setAddSiteDialog', false),
    withState('showCalenderDialog', 'setShowCalenderDialog', {
        show: false,
        siteId: '',
        siteName: '',
        timezone: '',
    }),
    withState('editTextItem', 'setEditTextItem', {}),
    withState('confirmSelectedItem', 'setConfirmSelectedItem', {}),
    withState('editSelectItem', 'setEditSelectItem', {}),
    withState('rowMenu', 'setRowMenu', null),
    graphql(getSites, {
        options: ({ studyId }) => ({
            variables: { studyId },
            fetchPolicy: 'network-only',
        }),
    }),
    withLoader,
    graphql(updateSite, {
        name: 'updateSiteMutation',
        options: refetchOption,
    }),
    graphql(addSite, {
        name: 'addSiteMutation',
        options: refetchOption,
    }),
    graphql(activateSite, {
        name: 'activateSiteMutation',
        options: refetchOption,
    }),
    graphql(deactivateSite, {
        name: 'deactivateSiteMutation',
        options: refetchOption,
    }),
    graphql(deleteSite, {
        name: 'deleteSiteMutation',
        options: refetchOption,
    }),
    withProps(({ data }) => ({
        sites: orderBy(get(data, 'sites'), ['countryCode', 'siteId']),
        proxyNumbers: {
            proxyNumber: get(data, 'proxyNumbers', []),
            inboundProxyNumber: get(data, 'inboundProxyNumbers', []),
        },
        timezones: get(data, 'timezones', []),
    })),
    withHandlers(
        ({
            updateSiteMutation,
            activateSiteMutation,
            deactivateSiteMutation,
            deleteSiteMutation,
            setEditSelectItem,
            setConfirmSelectedItem,
            setEditTextItem,
            setMapDialogItem,
            setRowMenu,
            setAlert,
        }) => ({
            handleConfirm: ({
                confirmSelectedItem: { action, variables, users },
            }) => confirmation => {
                const closeAll = () => {
                    setRowMenu(null);
                    setConfirmSelectedItem({});
                };
                if (!confirmation) return closeAll();

                let mutation;
                switch (action) {
                    case 'ACTIVATE':
                        mutation = activateSiteMutation;
                        break;
                    case 'DEACTIVATE':
                        mutation = deactivateSiteMutation;
                        break;
                    case 'DELETE':
                        mutation = deleteSiteMutation;
                        break;
                    default:
                        mutation = () => Promise.reject(new Error(`Unknown ${action}`));
                        break;
                }

                return mutation({ variables })
                    .then(() => {
                        if (users === 0)
                            setAlert(
                                "The site is active but it has no assigned nurse. Don't forget to add user(s).",
                            );
                    })
                    .catch(setAlert)
                    .finally(closeAll);
            },

            handleSelect: ({ editSelectItem, locales }) => value => {
                const site = { id: editSelectItem.id };
                if (editSelectItem.item === 'languages') {
                    site[editSelectItem.item] = value.map(locale => ({
                        locale,
                        name: get(
                            locales.find(l => l.locale === locale),
                            'language.name',
                            locale,
                        ),
                    }));
                } else {
                    site[editSelectItem.item] = value;
                }
                return updateSiteMutation({ variables: { site } })
                    .catch(setAlert)
                    .finally(() => {
                        setEditSelectItem({});
                        setRowMenu(null);
                    });
            },

            handleEditText: ({ editTextItem }) => value => {
                const site = { id: editTextItem.id };
                site[editTextItem.item] = value;
                return updateSiteMutation({ variables: { site } })
                    .catch(setAlert)
                    .finally(() => {
                        setEditTextItem({});
                        setRowMenu(null);
                    });
            },

            handleMap: ({ mapDialogItem }) => values =>
                updateSiteMutation({
                    variables: {
                        site: { id: mapDialogItem.id, ...values },
                    },
                })
                    .catch(setAlert)
                    .finally(() => {
                        setMapDialogItem({});
                        setRowMenu(null);
                    }),
            handleCheckbox: ({ mapDefaultItem }) => values => {
                console.log('[handleCheckbox]', mapDefaultItem)
                return updateSiteMutation({
                    variables: {
                        site: { id: mapDefaultItem.id, default: mapDefaultItem.default },
                    },
                })
                    .catch(setAlert)
                    .finally(() => {
                        console.log('[handleCheckbox final]')
                    })
            },
            handleMenuOpen: () => ({ event, site }) =>
                setRowMenu({ ...site, anchorEl: event.currentTarget }),

            handleMenuClose: () => () => setRowMenu(null),
        }),
    ),
)(Sites);
