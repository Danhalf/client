import React, { ReactElement, useEffect, useState } from "react";
import {
    createReportCollection,
    getUserFavoriteReportList,
    getUserReportCollectionsContent,
    moveReportToCollection,
    setCollectionOrder,
    setReportOrder,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import "./index.css";
import { BaseResponseError, Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Panel } from "primereact/panel";
import {
    NODE_TYPES,
    REPORT_TYPES,
    ReportCollection,
    ReportDocument,
    TOAST_MESSAGES,
} from "common/models/reports";
import { useStore } from "store/hooks";
import { CollectionPanelContent } from "dashboard/reports/common/panel-content";
import { ReportsPanelHeader } from "dashboard/reports/common/report-headers";
import { ActionButtons } from "dashboard/reports/common/report-buttons";
import { useNavigate } from "react-router-dom";
import { ReportParameters } from "./common/report-parameters";
import { TreeNodeEvent } from "common/models";
import { convertTreeNodesToCollections } from "./common/drag-and-drop";

const EDIT_COLLECTION_CLASSES: Readonly<string[]> = ["reports-actions__button", "p-button-label"];
const OPEN_PARAMETERS_CLASSES: Readonly<string[]> = [
    "reports__list-item--inner",
    "reports__list-item",
    "reports__list-name",
];

export default function Reports(): ReactElement {
    const navigate = useNavigate();
    const userStore = useStore().userStore;
    const { authUser } = userStore;

    const [reportSearch, setReportSearch] = useState<string>("");
    const [reportCollections, setReportCollections] = useState<ReportCollection[]>([]);
    const [customCollections, setCustomCollections] = useState<ReportCollection[]>([]);
    const [favoriteCollections, setFavoriteCollections] = useState<ReportCollection[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");

    const [newCollectionsReports, setNewCollectionsReports] = useState<ReportDocument[]>([]);
    const [selectedReports, setSelectedReports] = useState<ReportDocument[]>([]);
    const [isCollectionEditing, setIsCollectionEditing] = useState<string | null>(null);
    const [isParametersEditing, setIsParametersEditing] = useState<ReportDocument | null>(null);
    const [defaultReportsCount, setDefaultReportsCount] = useState<number>(0);

    const toast = useToast();

    const getReportCollections = () => {
        const qry = reportSearch;
        const params = { qry };
        return getUserReportCollectionsContent(
            authUser!.useruid,
            qry.length ? params : undefined
        ).then((response) => {
            const { error } = response as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                    life: TOAST_LIFETIME,
                });
            }
            if (Array.isArray(response)) {
                const collectionsWithoutFavorite = response.filter(
                    (collection: ReportCollection) => collection.description !== "Favorites"
                );
                const customCols = collectionsWithoutFavorite
                    ?.flatMap((col) => col.collections)
                    ?.filter(Boolean);

                const [firstCollection] = collectionsWithoutFavorite ?? [];
                const innerCollectionsDefaultsCount = firstCollection?.collections?.flatMap(
                    (c: ReportCollection) => c?.documents || []
                );

                setDefaultReportsCount(
                    (firstCollection?.documents?.length || 0) +
                        (innerCollectionsDefaultsCount?.length || 0)
                );

                setReportCollections(collectionsWithoutFavorite);
                setCustomCollections(customCols);
            } else {
                setReportCollections([]);
            }
        });
    };

    const getFavoriteReportCollections = () => {
        return getUserFavoriteReportList(authUser!.useruid).then((response) => {
            if (Array.isArray(response)) {
                setFavoriteCollections(response);
            }
        });
    };

    const handleGetUserReportCollections = async () => {
        await getFavoriteReportCollections();
        await getReportCollections();
    };

    useEffect(() => {
        if (authUser) {
            handleGetUserReportCollections();
        }
    }, [toast, authUser]);

    const handleCreateCollection = () => {
        if (!collectionName) return;
        createReportCollection(authUser!.useruid, {
            name: collectionName,
            documents: newCollectionsReports,
        }).then((response) => {
            const { error } = response as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                    life: TOAST_LIFETIME,
                });
            } else {
                handleGetUserReportCollections();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "New collection is successfully created!",
                    life: TOAST_LIFETIME,
                });
                setCollectionName("");
                setNewCollectionsReports([]);
            }
        });
    };

    const handleUpdateCollection = (itemuid: string, editCollectionName?: string) => {
        if (collectionName || editCollectionName) {
            createReportCollection(authUser!.useruid, {
                name: collectionName || editCollectionName,
                documents: selectedReports,
                itemuid,
            }).then((response) => {
                const { error } = response as BaseResponseError;
                if (error && toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error,
                        life: TOAST_LIFETIME,
                    });
                } else {
                    handleGetUserReportCollections();
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Collection is successfully updated!",
                        life: TOAST_LIFETIME,
                    });
                    setCollectionName("");
                    setSelectedReports([]);
                    setIsCollectionEditing(null);
                }
            });
        }
    };

    const handleCustomEditCollection = (event: React.MouseEvent<HTMLElement>, id: string) => {
        const target = event.target as HTMLElement;
        if (EDIT_COLLECTION_CLASSES.some((cls) => target.classList.contains(cls))) {
            event.stopPropagation();
            setIsCollectionEditing(id);
        }
    };

    const handleOpenParameters = (event: React.MouseEvent<HTMLElement>, report: ReportDocument) => {
        const target = event.target as HTMLElement;
        if (!OPEN_PARAMETERS_CLASSES.some((cls) => target.classList.contains(cls))) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        if (isParametersEditing?.itemUID === report.itemUID) {
            setIsParametersEditing(null);
        } else {
            setIsParametersEditing(report);
        }
    };

    const showError = (detail: string) => {
        toast.current?.show({
            severity: "error",
            summary: TOAST_MESSAGES.ERROR,
            detail,
            life: TOAST_LIFETIME,
        });
    };

    const showSuccess = (detail: string) => {
        toast.current?.show({
            severity: "success",
            summary: TOAST_MESSAGES.SUCCESS,
            detail,
            life: TOAST_LIFETIME,
        });
    };

    const treeValue: TreeNode[] = [...favoriteCollections, ...reportCollections].map(
        (collection: ReportCollection, index) => {
            const { itemUID, name, documents } = collection;

            let info = `(${documents?.length || 0} reports)`;
            if (index === 1) {
                info = `(${customCollections?.length || 0} collections / ${defaultReportsCount} reports)`;
            }
            const topLevelLabel = `${name} ${info}`;

            let children: TreeNode[] = [];
            const isEditingThisCollection = isCollectionEditing === itemUID;

            if (index === 1 && customCollections?.length) {
                children = customCollections.map((customCol) => {
                    const isEditingInnerCol = isCollectionEditing === customCol.itemUID;
                    const innerInfo = `(${customCol.documents?.length || 0} reports)`;
                    const customLabel = `${customCol.name || customCol.itemUID} ${innerInfo}`;

                    const colDocuments =
                        customCol.documents?.map((doc) => ({
                            key: doc?.itemUID,
                            label: doc?.name,
                            data: {
                                type: "doc",
                                report: doc,
                                parentCollectionUID: customCol.itemUID,
                            },
                        })) || [];

                    return {
                        key: customCol.itemUID,
                        label: customLabel,
                        data: {
                            type: "collection",
                            collection: customCol,
                            isEditing: isEditingInnerCol,
                        },
                        children: colDocuments,
                    };
                });
            }

            if (!isEditingThisCollection) {
                const docChildren =
                    documents?.map((report) => ({
                        key: report.itemUID,
                        label: report.name,
                        data: {
                            type: "doc",
                            report,
                            parentCollectionUID: itemUID,
                        },
                    })) || [];
                children = [...children, ...docChildren];
            }

            return {
                key: itemUID,
                label: topLevelLabel,
                data: {
                    type: "collection",
                    collection,
                    isEditing: isEditingThisCollection,
                    index,
                },
                children,
            };
        }
    );

    const nodeTemplate = (node: TreeNode) => {
        const data = node.data || {};
        const type = data.type;
        const isEditing = data.isEditing;

        if (type === "collection" && isEditing) {
            const thisCollection: ReportCollection = data.collection;
            return (
                <div className='edit-collection p-panel'>
                    <div className='p-panel-content relative'>
                        <CollectionPanelContent
                            handleClosePanel={() => {
                                setIsCollectionEditing(null);
                                handleGetUserReportCollections();
                            }}
                            collectionuid={thisCollection.itemUID}
                            collectionName={thisCollection.name}
                            collections={[...customCollections, ...reportCollections]}
                            selectedReports={thisCollection.documents || []}
                            setCollectionName={setCollectionName}
                            setSelectedReports={setSelectedReports}
                            handleCreateCollection={() =>
                                handleUpdateCollection(thisCollection.itemUID, thisCollection.name)
                            }
                        />
                    </div>
                </div>
            );
        }

        if (type === "collection" && !isEditing) {
            const thisCollection: ReportCollection = data.collection;
            const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
                handleCustomEditCollection(event, thisCollection.itemUID);
            };

            const hasNewDocuments = thisCollection.documents?.some((doc) => doc.isNew);
            const isMatchedBySearch =
                reportSearch &&
                thisCollection.name?.toLowerCase().includes(reportSearch.toLowerCase());

            return (
                <div className='reports__list-item'>
                    <p className={isMatchedBySearch ? "searched-item" : "reports__list-name"}>
                        {node.label}
                    </p>
                    {hasNewDocuments && (
                        <div className='reports-accordion-header__label ml-2'>New</div>
                    )}
                    {thisCollection.userUID === authUser?.useruid && !thisCollection.isfavorite && (
                        <Button
                            label='Edit'
                            className='reports-actions__button cursor-pointer'
                            outlined
                            onClick={handleEditClick}
                        />
                    )}
                </div>
            );
        }

        if (type === "doc") {
            const report: ReportDocument = data.report;
            const isNew = report.isNew;
            const isMatchedBySearch =
                reportSearch && report.name.toLowerCase().includes(reportSearch.toLowerCase());

            return (
                <React.Fragment>
                    <div
                        className='reports__list-item reports__list-item--inner'
                        onClick={(event) => handleOpenParameters(event, report)}
                        onDoubleClick={() => {
                            navigate(`/dashboard/reports/${report.documentUID}`);
                        }}
                    >
                        <p className={isMatchedBySearch ? "searched-item" : "reports__list-name"}>
                            {report.name}
                        </p>
                        {isNew && <div className='reports-accordion-header__label ml-2'>New</div>}
                        <ActionButtons
                            report={report}
                            collectionList={[reportCollections[0], ...customCollections].filter(
                                (col) => col.itemUID !== data.parentCollectionUID
                            )}
                            refetchCollectionsAction={handleGetUserReportCollections}
                            currentCollectionUID={data.parentCollectionUID}
                        />
                    </div>
                    {isParametersEditing?.documentUID === report.documentUID && (
                        <ReportParameters report={isParametersEditing} />
                    )}
                </React.Fragment>
            );
        }

        return <span>{node.label}</span>;
    };

    const updateDocumentOrderInCollection = async (collectionId: string) => {
        const collection = reportCollections.find((col) => col.itemUID === collectionId);
        if (!collection || !collection.documents) return;
        const updatedReports = collection.documents.map((doc, index) => ({
            ...doc,
            order: index,
        }));
        setReportCollections((prev) =>
            prev.map((collection) =>
                collection.itemUID === collectionId
                    ? { ...collection, documents: updatedReports }
                    : collection
            )
        );
    };

    const handleDragDrop = async (event: TreeDragDropEvent) => {
        const dragNode = event.dragNode as TreeNodeEvent | undefined;
        const dropNode = event.dropNode as TreeNodeEvent | undefined;
        const dropIndex = event.dropIndex;

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            (!!dropNode?.data?.collection?.isdefault || !!dropNode?.data?.collection?.isfavorite)
        ) {
            showError(TOAST_MESSAGES.MOVE_INTO_DEFAULT_ERROR);
            return;
        }

        if (
            dropNode?.type === NODE_TYPES.COLLECTION &&
            dragNode?.type !== NODE_TYPES.DOCUMENT &&
            (!!dropNode.data?.collection?.isdefault || !!dropNode.data?.collection?.isfavorite)
        ) {
            showError(TOAST_MESSAGES.CANNOT_MOVE_INTO_DEFAULT_COLLECTION);
            return;
        }

        const updatedNodes = event.value as TreeNode[];
        const favoriteNode = updatedNodes.find((node) => node.label === REPORT_TYPES.FAVORITES);
        const otherNodes = updatedNodes.filter((node) => node.label !== REPORT_TYPES.FAVORITES);
        let newFavoriteCollections: ReportCollection[] = [];
        let newCollections: ReportCollection[] = [];
        if (favoriteNode) {
            const favCols = convertTreeNodesToCollections([favoriteNode as TreeNodeEvent]);
            if (favCols.length > 0) {
                newFavoriteCollections = favCols;
            }
        }
        const converted = convertTreeNodesToCollections(otherNodes as TreeNodeEvent[]);
        newCollections = converted;
        setFavoriteCollections(newFavoriteCollections);
        setReportCollections(newCollections);

        const dragData = dragNode?.data;
        const dropData = dropNode?.data;

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dragData?.document &&
            dropNode?.type !== NODE_TYPES.COLLECTION
        ) {
            const collectionId = dragData.collectionId;
            const currentCollectionsLength =
                reportCollections.find((collection) => collection.itemUID === collectionId)
                    ?.collections?.length || 0;

            if (collectionId && dragData.document.documentUID != null && dropIndex != null) {
                const response = await setReportOrder(
                    collectionId,
                    dragData.document.documentUID,
                    dropIndex - currentCollectionsLength
                );
                if (response?.error) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                    await updateDocumentOrderInCollection(collectionId);
                }
            }
        }

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dropNode?.type === NODE_TYPES.COLLECTION &&
            dragData?.document
        ) {
            const sourceCollectionId = dragData.collectionId;
            const targetCollectionId = dropData.collection.itemUID;
            const reportId = dragData.document.documentUID;
            if (sourceCollectionId !== targetCollectionId) {
                const response = await moveReportToCollection(
                    sourceCollectionId,
                    reportId,
                    targetCollectionId
                );
                if (response && response.status === Status.ERROR) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                }
            }
        }

        if (dragNode?.type === NODE_TYPES.COLLECTION && dragData?.collection && dropIndex != null) {
            const sourceCollectionId = dragData.collection.itemUID;
            if (sourceCollectionId) {
                const response = await setCollectionOrder(sourceCollectionId, dropIndex);
                if (response && response.status === Status.ERROR) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.COLLECTION_REORDERED_SUCCESS);
                }
            }
        }
    };

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card reports'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Reports</h2>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='col-12'>
                                <Panel
                                    headerTemplate={(options) =>
                                        ReportsPanelHeader({
                                            options,
                                            navigatePath: "create",
                                            state: reportSearch,
                                            isConfirm:
                                                !!selectedReports.length || !!collectionName.length,
                                            setStateAction: setReportSearch,
                                        })
                                    }
                                    className='edit-collection w-full'
                                    collapsed
                                    toggleable
                                >
                                    <CollectionPanelContent
                                        collectionName={collectionName}
                                        collections={[...customCollections, ...reportCollections]}
                                        selectedReports={newCollectionsReports}
                                        setCollectionName={setCollectionName}
                                        setSelectedReports={setNewCollectionsReports}
                                        handleCreateCollection={handleCreateCollection}
                                    />
                                </Panel>
                            </div>

                            <div className='col-12'>
                                <Tree
                                    className='reports__tree'
                                    dragdropScope='reports'
                                    onDragDrop={handleDragDrop}
                                    value={treeValue}
                                    nodeTemplate={nodeTemplate}
                                    filter={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
