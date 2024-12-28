import { TreeNodeEvent } from "common/models";
import { ReportCollection, NODE_TYPES, ReportDocument } from "common/models/reports";

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
