import { ReportCollection, ReportDocument } from "common/models/reports";
import {
    getUserFavoriteReportList,
    getUserReportCollectionsContent,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { ReportEditForm } from "./edit";
import { observer } from "mobx-react-lite";
import { ReportFooter } from "./common";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";

enum REPORT_TYPES {
    FAVORITES = "Favorites",
    CUSTOM = "Custom reports",
}

export const ReportForm = observer((): ReactElement => {
    const userStore = useStore().userStore;
    const reportStore = useStore().reportStore;
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { authUser } = userStore;
    const toast = useToast();
    const [collections, setCollections] = useState<ReportCollection[]>([]);
    const [favoriteCollections, setFavoriteCollections] = useState<ReportCollection[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const handleGetUserReportCollections = async (useruid: string) => {
        const response = await getUserReportCollectionsContent(useruid);
        if (Array.isArray(response)) {
            const collectionsWithoutFavorite = response.filter(
                (collection: ReportCollection) => collection.description !== REPORT_TYPES.FAVORITES
            );

            const customReportsCollection = collectionsWithoutFavorite.find(
                (collection: ReportCollection) => collection.name === REPORT_TYPES.CUSTOM
            );

            if (customReportsCollection) {
                setCollections([
                    customReportsCollection,
                    ...collectionsWithoutFavorite.filter(
                        (collection) => collection.name !== REPORT_TYPES.CUSTOM
                    ),
                ]);
            } else {
                setCollections(collectionsWithoutFavorite);
            }
        } else {
            setCollections([]);
        }
    };

    useEffect(() => {
        if (authUser) {
            handleGetUserReportCollections(authUser.useruid);
            getUserFavoriteReportList(authUser.useruid).then((response) => {
                if (Array.isArray(response)) {
                    setFavoriteCollections(response);
                }
            });
        }
    }, [authUser]);

    const transformDocumentsToNodes = (documents?: ReportDocument[]): TreeNode[] => {
        return (
            documents?.map((doc) => ({
                key: doc.itemUID,
                label: doc.name,
                type: "document",
                data: { ...doc },
            })) || []
        );
    };

    const transformCollectionsToNodes = (collections?: ReportCollection[]): TreeNode[] => {
        return collections?.map((col) => transformCollectionToNode(col)) || [];
    };

    const transformCollectionToNode = (collection: ReportCollection): TreeNode => {
        const children: TreeNode[] = [];

        if (collection.collections) {
            children.push(...transformCollectionsToNodes(collection.collections));
        }

        if (collection.documents) {
            children.push(...transformDocumentsToNodes(collection.documents));
        }

        return {
            key: collection.itemUID,
            label: collection.name,
            // type: "collection",
            data: { ...collection },
            children,
        };
    };

    const rootNodes = [
        ...favoriteCollections.map((c) => transformCollectionToNode(c)),
        ...collections.map((c) => transformCollectionToNode(c)),
    ];

    const handleNodeSelect = (node: TreeNode) => {
        const data = node.data as ReportDocument | ReportCollection;
        if ("documentUID" in data && data.documentUID) {
            if (data.documentUID === id) return;
            reportStore.report = data as ReportDocument;
            reportStore.reportName = data.name;
            setSelectedKey(data.itemUID);
            navigate(`/dashboard/reports/${data.itemUID}`);
        }
    };

    const handleDragDrop = async (event: any) => {
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Node order updated successfully!",
            life: TOAST_LIFETIME,
        });
    };

    return (
        <div className='grid relative'>
            <Button
                icon='pi pi-times'
                className='p-button close-button'
                onClick={() => navigate("/dashboard/reports")}
            />
            <div className='col-12'>
                <div className='card report'>
                    <div className='card-header flex'>
                        <h2 className='report__title uppercase m-0'>
                            {id ? "Edit" : "Create custom"} report
                        </h2>
                        {id && (
                            <Button
                                outlined
                                className='button-rounded ml-3'
                                onClick={() => navigate("/dashboard/reports/create")}
                            >
                                Create new report
                            </Button>
                        )}
                    </div>
                    <div className='card-content report__card grid'>
                        <div className='col-4'>
                            <Tree
                                value={rootNodes}
                                dragdropScope='inventory'
                                onDragDrop={handleDragDrop}
                                onSelect={(e) => handleNodeSelect(e.node)}
                                selectionMode='single'
                                selectionKeys={selectedKey as any}
                                onSelectionChange={(e) => setSelectedKey(e.value as string)}
                                className='report__tree'
                            />
                        </div>
                        <ReportEditForm />
                    </div>
                    <ReportFooter
                        onRefetch={() => {
                            handleGetUserReportCollections(authUser!.useruid);
                        }}
                    />
                </div>
            </div>
        </div>
    );
});
