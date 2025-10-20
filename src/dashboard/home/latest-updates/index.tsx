import { useToastMessage } from "common/hooks";
import { News } from "common/models/tasks";
import { SupportHistoryDialog } from "dashboard/profile/supportHistory";
import { getLatestNews } from "http/services/tasks.service";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";
import { TruncatedText } from "dashboard/common/display";
import { parseDateFromServer } from "common/helpers";

interface LatestUpdatesProps {
    messagesShowCount?: number;
}

export const LatestUpdates = ({ messagesShowCount = 4 }: LatestUpdatesProps): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const [dialogActive, setDialogActive] = useState<boolean>(false);
    const [newsData, setNewsData] = useState<News[]>([]);
    const { showError } = useToastMessage();

    const handleGetLatestNews = async () => {
        if (!authUser) return;
        const response = await getLatestNews(authUser.useruid);
        if (response && Array.isArray(response)) {
            setNewsData(response);
        } else {
            showError(response?.error);
        }
    };

    useEffect(() => {
        handleGetLatestNews();
    }, [authUser]);

    return (
        <section className='card h-full latest-updates'>
            <div className='card-header latest-updates__header'>
                <h2 className='card-header__title uppercase m-0'>Latest updates</h2>
            </div>
            <div className='card-content latest-updates__content'>
                <ul className='latest-updates__list'>
                    {newsData.slice(0, messagesShowCount).map((news) => (
                        <li className='latest-updates__item' key={news.itemuid}>
                            <span className='latest-updates__item-description'>
                                <TruncatedText withTooltip text={news.description} />
                            </span>
                            <span className='latest-updates__item-created'>
                                {parseDateFromServer(news.created, "date")}
                            </span>
                        </li>
                    ))}
                </ul>
                {newsData.length > messagesShowCount && (
                    <div className='card-content__footer latest-updates__footer'>
                        <Button
                            onClick={() => setDialogActive(true)}
                            className='underline messages-more latest-updates__button'
                            text
                        >
                            See more...
                        </Button>
                    </div>
                )}
            </div>
            {authUser && (
                <SupportHistoryDialog
                    onHide={() => setDialogActive(false)}
                    visible={dialogActive}
                />
            )}
        </section>
    );
};
