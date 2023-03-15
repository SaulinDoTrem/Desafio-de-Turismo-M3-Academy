export class TouristList {
    constructor() {
        this.selectors();
        this.events();
        this.initializer();
    }

    selectors() {
        this.inputFileImage = document.getElementById("tourist-form-image-input");
        [this.imagePreview] = document.getElementsByClassName("tourist-form-image-label");
        [this.slickDiv] = document.getElementsByClassName("tourist-attractions-slick");
        [this.touristForm] = document.getElementsByClassName("tourist-form");
        [this.touristFormLabelImage] = document.getElementsByClassName("tourist-form-image-label");
        [this.touristFormDescriptionInput] = document.getElementsByClassName(
            "tourist-form-text-input-description"
        );
        [this.touristFormTitleInput] = document.getElementsByClassName(
            "tourist-form-text-input-title"
        );
        this.initialItems = [
            {
                title: "Pão de Açúcar",
                description:
                    "Amet minim mollit non deserunt ullamco est sit aliqua dolor dosa amet sint. Velit officia consece duis enim velit mollit.",
                imageSource: "assets/imgs/item-list-image01.png",
                imageSourceMobile: "assets/imgs/item-list-image01-mobile.png",
            },
            {
                title: "Cristo Redentor",
                description:
                    "Amet minim mollit non deserunt ullamco est sit aliqua dolor dosa amet sint. Velit officia consece duis enim velit mollit.",
                imageSource: "assets/imgs/item-list-image02.png",
                imageSourceMobile: "assets/imgs/item-list-image02-mobile.png",
            },
            {
                title: "Ilhas Grandes",
                description:
                    "Amet minim mollit non deserunt ullamco est sit aliqua dolor dosa amet sint. Velit officia consece duis enim velit mollit.",
                imageSource: "assets/imgs/item-list-image03.png",
                imageSourceMobile: "assets/imgs/item-list-image03-mobile.png",
            },
            {
                title: "Centro Histórico de Paraty",
                description:
                    "Amet minim mollit non deserunt ullamco est sit aliqua dolor dosa amet sint. Velit officia consece duis enim velit mollit.",
                imageSource: "assets/imgs/item-list-image04.png",
                imageSourceMobile: "assets/imgs/item-list-image04-mobile.png",
            },
        ];
        this.initialItemsReady = document.getElementsByClassName("tourist-attractions-slick-item");
        this.counter = 0;
    }

    events() {
        this.addSlick();
        this.inputFileImage.addEventListener("change", this.uploadImage.bind(this));
        window.addEventListener("resize", this.resizeEvents.bind(this));
        this.touristForm.addEventListener("submit", this.addSlickItemToList.bind(this));
    }

    resizeEvents() {
        this.resizeSlick();
        this.resizeImage();
    }

    initializer() {
        this.initialItems.map((e) => {
            const figure = this.createSlickItemList(e);
            $(".tourist-attractions-slick").slick("slickAdd", figure);
        });
    }

    addSlickItemToList(event) {
        event.preventDefault();
        const target = event.target;

        const item = {
            title: this.touristFormTitleInput.value,
            description: this.touristFormDescriptionInput.value,
            imageSource: target["tourist-form-image"].src,
        };

        const figure = this.createSlickItemList(item);

        if (window.innerWidth < 1025) this.slickDiv.appendChild(figure);
        else $(".tourist-attractions-slick").slick("slickAdd", figure);

        this.resetInputs(target);
    }

    resetInputs(target) {
        const [previewFigure] = document.getElementsByClassName("preview-figure");
        target["tourist-form-image-input"].value = "";
        this.touristFormTitleInput.value = "";
        this.touristFormDescriptionInput.value = "";

        this.touristFormLabelImage.removeChild(previewFigure);
        this.touristFormLabelImage.innerHTML = "Imagem";
    }

    createSlickItemList(item) {
        let src = item.imageSource;
        if (item.imageSourceMobile && window.innerWidth < 1025) src = item.imageSourceMobile;

        const figure = document.createElement("figure");
        figure.classList.add("tourist-attractions-slick-item");
        figure.setAttribute("data-test", "item-list");

        const img = document.createElement("img");
        img.classList.add("tourist-attractions-slick-item-image");
        img.src = src;
        img.alt = item.description;
        img.setAttribute("data-test", "image-item-list");

        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.classList.add("tourist-attractions-slick-item-text");

        figure.appendChild(figcaption);

        const h2 = document.createElement("h2");
        h2.classList.add("tourist-attractions-slick-item-text-title");
        h2.innerText = item.title;
        h2.setAttribute("data-test", "title-item-list");

        figcaption.appendChild(h2);

        const p = document.createElement("p");
        p.classList.add("tourist-attractions-slick-item-text-description");
        p.innerText = item.description;
        p.setAttribute("data-test", "description-item-list");

        figcaption.appendChild(p);

        return figure;
    }

    addSlick() {
        $(".tourist-attractions-slick").slick({
            dots: true,
            speed: 300,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1025,
                    settings: "unslick",
                },
            ],
        });
    }

    removeSlick() {
        $(".tourist-attractions-slick").slick("unslick");
    }

    resizeSlick() {
        if (window.innerWidth > 1024) {
            if (!this.slickDiv.classList.contains("slick-initialized")) this.addSlick();
        } else if (this.slickDiv.classList.contains("slick-initialized")) {
            this.removeSlick();
            const children = this.slickDiv.children;
            if (children[0].style.width)
                Object.values(children).map((e) => (e.style.width = "100%"));
        }
    }

    resizeImage() {
        let source = "imageSource";
        if (window.innerWidth < 1025) source = "imageSourceMobile";

        Object.values(this.initialItemsReady).map((e, i) => {
            if (i > 3) return;
            const [img] = e.children;
            img.src = this.initialItems[i][source];
        });
    }

    uploadImage(event) {
        const inputTarget = event.target;
        const [file] = inputTarget.files;

        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", this.addImageToInput.bind(this));
        reader.readAsDataURL(file);
    }

    addImageToInput(event) {
        const target = event.target;
        const figure = document.createElement("figure");
        figure.classList.add("preview-figure");

        const img = document.createElement("img");
        img.src = target.result;
        img.classList.add("preview-figure-image");
        img.id = "tourist-form-image";

        figure.appendChild(img);
        this.imagePreview.innerHTML = "";
        this.imagePreview.appendChild(figure);
    }
}
