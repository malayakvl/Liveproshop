import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

interface PropsContent {
    locale: string;
}
const Rules: React.FC<PropsContent> = ({ locale }) => {
    const t = useTranslations();
    return (
        <>
            {locale == 'fr' ? (
                <>
                    <h2 className="dark-blue-header mb-[10px] hidden">
                        Guides - Règles de remplissage des fichiers CSV!
                    </h2>
                    <div className="overflow-x-scroll">
                        <table className="table-auto text-sm">
                            <thead>
                                <tr
                                    className="text-xs"
                                    style={{ borderBottom: 'solid 1px #EEF1F7' }}>
                                    <th className="w-32 py-4">Column</th>
                                    <th>Regles d’importation</th>
                                    <th>Obligatoire</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    style={{
                                        borderBottom: 'solid 1px #EEF1F7'
                                    }}>
                                    <td className="font-bold">name</td>
                                    <td className="py-4">
                                        Ce champ doit contenir le nom du produit
                                    </td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        borderBottom: 'solid 1px #EEF1F7'
                                    }}>
                                    <td className="font-bold">description</td>
                                    <td className="py-4">
                                        Ce champ doit contenir le nom du produit
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">hashtag</td>
                                    <td className="py-4">
                                        <p>
                                            Ce champ peut contenir des hashtags. Chaque hashtag doit
                                            être séparé par une virgule.
                                        </p>
                                        Exemple
                                        <p className="text-[10px] italic">
                                            Exemple: #homme, #sport
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">style_value</td>
                                    <td className="py-4">
                                        Ce champ peut contenir une liste de styles. Chacun doit être
                                        séparé par une virgule.
                                        <p className="text-[10px] italic">
                                            Example: décontracté, sport
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">material_value</td>
                                    <td className="py-4">
                                        Ce champ doit contenir la matière
                                        <p className="text-[10px] italic">Exemple: Coton</p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">photos</td>
                                    <td className="py-4">
                                        <p>
                                            Ici, vous pouvez ajouter des liens vers des photos.
                                            Chaque lien doit être séparé par le signe @.
                                        </p>
                                        <p>
                                            La photo contenue dans le lien doit être accessible au
                                            public, sinon le système ne l`ajoutera pas.
                                        </p>
                                        <p>Exemple:</p>
                                        <img
                                            src="https://miro.medium.com/v2/resize:fit:640/1*JcJg__XN_0vdh-RybxgSiw.png"
                                            alt=""
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">publish</td>
                                    <td className="py-4">
                                        Ce champ définit si votre produit sera vu et disponible pour
                                        les acheteurs ou non. Inscrivez “TRUE“ si vous souhaitez que
                                        le produit soit publié et visible. Ou écrivez “FALSE“ et le
                                        produit sera dans le système mais ne sera pas disponible
                                        pour les acheteurs pendant le live
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">sku</td>
                                    <td className="py-4">
                                        Ici, vous pouvez ajouter une UGS (les lettres et les
                                        chiffres sont autorisés).
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">size</td>
                                    <td className="py-4">
                                        Ce champ contient des valeurs de taille(s).
                                        <p className="text-[10px] italic">
                                            Exemple: S,M,L, XL, etc.
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">color</td>
                                    <td className="py-4">
                                        Ce champ contient les valeurs de couleur du produit (vert,
                                        bleu, rouge, etc.).
                                        <p className="text-[10px] italic">
                                            Exemple: Green, Blue, Red etc.
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">price</td>
                                    <td className="py-4">
                                        Ce champ doit contenir le prix du produit (nombre).
                                    </td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">quantity</td>
                                    <td className="py-4">
                                        Ce champ doit contenir la quantité du produit (nombre).
                                    </td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="my-12 mb-10">
                        {/*<Image src="/images/guides/rules-csv1.png" width={1393} height={172} />*/}
                        <p className="mt-5 text-left">
                            Voici à quoi devrait ressembler votre tableur lorsque toutes les donnes
                            ont été correctement remplies.
                        </p>
                        <img src="/images/rules/tbl2.png" className="mx-auto mt-5 mb-5" alt="" />
                        <p className="mt-5 text-left">
                            *Veuillez noter que le système n`accepte que les couleurs suivantes dans
                            votre CSV : Rouge, Jaune, Bleu, Vert, Noir, Blanc, Multi, Gris, Argent,
                            Orange, Mauve, Rose, Bronze, Marron, Doré, Beige
                            <br />
                            Et matière: Coton, Polyester, Cuir, Velours, Jean , Polaire, Cachemire,
                            Mousseline de soie, Soie, Laine
                        </p>
                    </div>
                    <div className=" pb-2.5 mb-6">
                        <h2 className="dark-blue-header block mb-[10px]">
                            Comment ajouter des variantes à un produit ?
                        </h2>
                        <p>
                            Si votre produit comporte des variations (par exemple, un T-shirt avec
                            la même image mais de tailles différentes), vous devez suivre ces règles
                            :
                        </p>
                        <div className="rounded-gray-block">
                            <ol>
                                <li>1. Fill in the fields from “Name” to “Publish” columns </li>
                                <li>
                                    2. Go to the string below and enter all possible variations that
                                    your product has.
                                </li>
                                <li>3. Remplissez les champs des colonnes “Name“ à “Publish“.</li>
                                <li>
                                    4. Allez dans la cellule en dessous et entrez toutes les
                                    variations possibles de votre produit.
                                </li>
                            </ol>
                        </div>
                        <p className="mt-5">
                            Par exemple, vous avez des jupes de femmes dans différentes variantes :
                            <br />
                            <br />
                            S/vert qui coûte 50€ et 2 articles sont disponibles en stock
                            <br />
                            M/vert qui coûte 60€ et 3 articles sont disponibles en stock
                            <br />
                            L/vert qui coûte 70€ et 4 articles sont disponibles en stock
                        </p>
                        <p>
                            Voici à quoi devrait ressembler ce produit dans le document csv
                            <img src="/images/rules/tbl1.png" className="mx-auto mt-4" alt="" />
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="dark-blue-header mb-[10px] hidden">CSV file Population rules</h2>
                    <div className="overflow-x-scroll">
                        <table className="table-auto text-sm">
                            <thead>
                                <tr
                                    className="text-xs"
                                    style={{ borderBottom: 'solid 1px #EEF1F7' }}>
                                    <th className="w-32 py-4">Column</th>
                                    <th>Rule</th>
                                    <th>Mandatory</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    style={{
                                        borderBottom: 'solid 1px #EEF1F7'
                                    }}>
                                    <td className="font-bold">name</td>
                                    <td className="py-4">This field should contain product name</td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        borderBottom: 'solid 1px #EEF1F7'
                                    }}>
                                    <td className="font-bold">description</td>
                                    <td className="py-4">
                                        This field should contain Product description (text
                                        description)
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">hashtag</td>
                                    <td className="py-4">
                                        This field should contain Product description (text
                                        description)
                                        <p className="text-[10px] italic">Example: #man, #sport</p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">style_value</td>
                                    <td className="py-4">
                                        This field may contain a list of styles. Each has to be
                                        separated by comma.
                                        <p className="text-[10px] italic">
                                            {t('Example')}: casual, sport
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">material_value</td>
                                    <td className="py-4">
                                        This field should contain Material Type
                                        <p className="text-[10px] italic">{t('Example')}: Cotton</p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">photos</td>
                                    <td className="py-4">
                                        <p>
                                            Here you may add photos links. Each link has to be
                                            separated by the At sign @
                                        </p>
                                        <p>
                                            The photo inside the link should be publicly available
                                            otherwise the system will not add it.
                                        </p>
                                        <p>Exemple:</p>
                                        <img
                                            src="https://miro.medium.com/v2/resize:fit:640/1*JcJg__XN_0vdh-RybxgSiw.png"
                                            alt=""
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">publish</td>
                                    <td className="py-4">
                                        This field defines whether your product will be seen and
                                        available to the buyers or not. Write “TRUE” if you want the
                                        product to be published and seen. Or write “FALSE“ and the
                                        product will be in the system but will not be available for
                                        buyers during live session.
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">sku</td>
                                    <td className="py-4">
                                        Here you may add an SKU (Letters and numbers are allowed)
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">size</td>
                                    <td className="py-4">
                                        Size
                                        <p className="text-[10px] italic">
                                            Example S, M, L, XL etc.
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">color</td>
                                    <td className="py-4">
                                        This field contains color values of the product
                                        <p className="text-[10px] italic">
                                            (Green, Blue, Red etc.)
                                        </p>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold">price</td>
                                    <td className="py-4">
                                        This field should contain the price of the product (number)
                                    </td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">quantity</td>
                                    <td className="py-4">
                                        This field should contain the quantity of the product
                                        (number)
                                    </td>
                                    <td>
                                        <img
                                            src="/images/icon-checked.svg"
                                            width="20"
                                            height="20"
                                            className="mx-auto"
                                            alt={t('Mandatory')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="my-12 mb-10 text-center">
                        {/*<Image src="/images/guides/rules-csv1.png" width={1393} height={172} />*/}
                        <p className="mt-5 text-left">
                            This is how the csv string should look like when all data was populated
                            correctly
                        </p>
                        <img src="/images/rules/tbl2.png" className="mx-auto mt-4" alt="" />
                        <p className="mt-5 text-left">
                            *Please note that system only accept the following color in your CSV:
                            Red, Yellow, Blue, Green, Black, White, Multi, Gray, Silver, Orange,
                            Purple, Pink, Bronze, Brown, Gold, Beige/Tan
                            <br />
                            and material: Cotton, Polyester, Leather, Velvet, Denim, Fleece,
                            Cashmere, Chiffon, Silk, Wool, Velour
                        </p>
                    </div>
                    <div className=" pb-2.5 mb-6">
                        <h2 className="dark-blue-header block mb-[10px]">
                            How to add variations to one product?
                        </h2>
                        <p>
                            In case your product has modifications (eg. T-shirt with the same image
                            but of different sizes) then you should follow these rules:
                        </p>
                        <div className="rounded-gray-block">
                            <ol>
                                <li>1. Fill in the fields from “Name” to “Publish” columns </li>
                                <li>
                                    2. Go to the string below and enter all possible variations that
                                    your product has.
                                </li>
                                <li>3. Remplissez les champs des colonnes “Name“ à “Publish“.</li>
                                <li>
                                    4. Allez dans la cellule en dessous et entrez toutes les
                                    variations possibles de votre produit.
                                </li>
                            </ol>
                        </div>
                        <p className="mt-5">
                            For example, you have women skirt in different variations:
                            <br />
                            <br />
                            S/green that costs 50€ and 2 items are available in stock
                            <br />
                            M/green that costs 60€ and 3 items are available in stock
                            <br />
                            L/green that costs 70€ and 4 items are available in stock
                        </p>
                        <p>
                            This is how this product should look like in the csv document
                            <img src="/images/rules/tbl1.png" className="mx-auto mt-4" alt="" />
                        </p>
                    </div>
                </>
            )}
        </>
    );
};
export default Rules;
