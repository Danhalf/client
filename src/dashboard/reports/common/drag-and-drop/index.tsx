import { TreeNodeEvent } from "common/models";
import { ReportCollection, NODE_TYPES, ReportDocument } from "common/models/reports";
import { TreeNode } from "primereact/treenode";

const countNested = (collection: ReportCollection): number => {
    let totalDocs = collection.documents?.length ?? 0;

    if (collection.collections?.length) {
        for (const childCol of collection.collections) {
            const nested = countNested(childCol);
            totalDocs += nested;
        }
    }

    return totalDocs;
};

export const buildTreeNodes = (
    collectionsData: ReportCollection[],
    countInfo: boolean = false
): TreeNode[] => {
    return collectionsData
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((col) => {
            const docsCount = col.documents?.length || 0;
            let labelText = col.name;
            let jsxContent: JSX.Element | null = null;

            if (countInfo) {
                if (col.name === "Custom reports") {
                    const nested = countNested(col);
                    labelText = `${col.name} (${col.collections?.length || 0} collections / ${nested} reports)`;
                    jsxContent = (
                        <>
                            {col.name}
                            <div className='reports-accordion-header__info'>
                                ({col.collections?.length || 0} collections / {nested} reports)
                            </div>
                        </>
                    );
                } else {
                    labelText = `${col.name} (${docsCount} reports)`;
                    jsxContent = (
                        <>
                            {col.name}
                            <div className='reports-accordion-header__info'>
                                ({docsCount} reports)
                            </div>
                        </>
                    );
                }
            }

            let children: TreeNode[] = [];
            if (col.collections?.length) {
                children = buildTreeNodes(col.collections, countInfo);
            }
            if (col.documents?.length) {
                const docNodes = col.documents.map((doc) => ({
                    key: doc.itemUID,
                    label: doc.name,
                    type: NODE_TYPES.DOCUMENT,
                    data: {
                        type: NODE_TYPES.DOCUMENT,
                        document: doc,
                    },
                }));
                children.push(...docNodes);
            }

            return {
                key: col.itemUID,
                label: labelText,
                type: NODE_TYPES.COLLECTION,
                data: {
                    type: NODE_TYPES.COLLECTION,
                    collection: col,
                    jsxContent,
                },
                children,
            };
        });
};

export const convertTreeNodesToCollections = (
    nodes: TreeNodeEvent[],
    parentCollection?: ReportCollection
): ReportCollection[] => {
    return nodes.map((node, index) => {
        const data = node.data || {};
        const isCollection = node.type === NODE_TYPES.COLLECTION;
        if (isCollection) {
            const collectionData: ReportCollection = {
                ...data.collection,
                order: index,
                documents: [],
                collections: data.collection?.collections || [],
            };
            if (node.children && node.children.length) {
                const docs: ReportDocument[] = [];
                const cols: ReportCollection[] = [];
                node.children.forEach((children, i) => {
                    const child = children as TreeNodeEvent;
                    if (child.type === NODE_TYPES.DOCUMENT) {
                        const docData = child.data || {};
                        docs.push({
                            ...docData.document,
                            order: i,
                        });
                    } else if (child.type === NODE_TYPES.COLLECTION) {
                        const subCols = convertTreeNodesToCollections([child], collectionData);
                        cols.push(...subCols);
                    }
                });
                collectionData.documents = docs;
                collectionData.collections = cols;
            }
            return collectionData;
        } else {
            return parentCollection!;
        }
    });
};
